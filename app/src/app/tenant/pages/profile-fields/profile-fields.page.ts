import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import * as uuid from 'uuid';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TenantService } from '../../store';
import { ContentTypeFieldQuery, ContentTypeFieldService, SessionQuery } from '~lib/store';
import { DragulaService } from 'ng2-dragula';
import { MatDialog } from '@angular/material/dialog';
import { ContentFieldSelectorModalComponent } from '~lib/ui/modals';
import camelCase from 'camelcase';

@Component({
	templateUrl: './profile-fields.page.html'
})
export class ProfileFieldsPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormArray;
	public contentType: any;
	public tenantUuid: string;
	public contentFields: any[] = [];
	public openFields = {};
	public fieldsIdentifier = uuid.v4();

	constructor(
		private tenantService: TenantService,
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private toastr: ToastrService,
		private sessionQuery: SessionQuery,
		private dragulaService: DragulaService,
		private contentTypeFieldService: ContentTypeFieldService,
	) { }

	private fetch(tenantUuid: string): void {
		this.tenantService.fetchOne(tenantUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.buildFieldsArray(values.profileFields || []).map((formGroup) => {
					this.form.push(formGroup);
				});
			});
	}

	public ngOnInit(): void {
		this.contentTypeFieldService.fetchContentFields()
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((contentFields: any) => this.contentFields = contentFields);


		this.sessionQuery.select()
			.pipe(
				first()
			)
			.subscribe(({ tenant }) => {
				this.tenantUuid = tenant.uuid;
				this.fetch(tenant.uuid);
			});

		this.form = this.formBuilder.array([]);
		this.dragulaService.createGroup(this.fieldsIdentifier, {
			moves: (el, container, handle) => {
				return el.querySelector(':scope > * > div > div > div > .m-field__handle-bar') === handle;
			}
		});
	}

	public findFieldConfiguration(identifier) {
		// return this.contentFields.find((x) => x.identifier === identifier);
		return { config: [] };
	}

	public handleFieldsUpdate(newFieldsOrder: any[], subfieldIndex?: number) {
		this.rebuildFieldsArray(this.form, newFieldsOrder);
	}

	public rebuildFieldsArray(formArray: FormArray, newStructure: any[]) {
		formArray.clear();

		const newFormArray = this.buildFieldsArray(newStructure);
		newFormArray.map((formGroup) => {
			formArray.push(formGroup);
		});
	}

	private buildFieldsArray(fields) {
		return fields.map((field) => {
			const fieldConfiguration = this.findFieldConfiguration(field.fieldType);

			const config = fieldConfiguration.config.reduce((acc, fieldConfig) => ({
				...acc,
				[fieldConfig.identifier]: [pathOr(null, ['config', fieldConfig.identifier])(field)]
			}), {});

			const fieldForm = this.formBuilder.group({
				uuid: [field.uuid],
				name: [field.name],
				slug: [field.slug],
				showOnOverview: [field.showOnOverview],
				multiLanguage: [field.multiLanguage],
				fieldType: [field.fieldType],
				config: this.formBuilder.group(config),
			});

			fieldForm.get('name').valueChanges
				.pipe(
					takeUntil(this.componentDestroyed$)
				).subscribe((value) => fieldForm.patchValue({
					slug: camelCase(value)
				}));

			return fieldForm;
		});
	}

	public removeField(i: number, subfieldIndex?: number) {
		this.form.removeAt(i);
	}

	public toggleFieldExpansion(i: number) {
		this.openFields[i] = !pathOr(false, [i])(this.openFields);
	}

	public selectContentField(): void {
		const dialogRef = this.dialog.open(ContentFieldSelectorModalComponent);

		dialogRef.afterClosed()
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((value) => {
				if (!value) {
					return;
				}

				this.pushFieldToArray(value);
			});
	}

	public pushFieldToArray(field): void {
		const config = (field.config || []).reduce((acc, fieldConfig) => ({
			...acc,
			[fieldConfig.identifier]: ['']
		}), {});

		const fieldForm = this.formBuilder.group({
			name: [field.name],
			slug: [''],
			fieldType: [field.identifier],
			multiLanguage: [false],
			showOnOverview: [false],
			config: this.formBuilder.group(config),
		});

		fieldForm.get('name').valueChanges
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => fieldForm.patchValue({
				slug: camelCase(value)
			}));

		this.form.push(fieldForm);
	}

	public submit(e: Event) {
		this.tenantService.update(
			this.tenantUuid,
			{
				profileFields: this.form.value
			}
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Settings updated', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { pathOr } from 'ramda';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ContentFieldSelectorModalComponent } from '../../modals';
import { first, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Subject } from 'rxjs';
import propOr from 'ramda/es/propOr';
import camelCase from 'camelcase';
import { DragulaService } from 'ng2-dragula';
import slugify from 'slugify';

@Component({
	selector: 'app-entity-type-form',
	templateUrl: 'entity-type-form.component.html',
})
export class EntityTypeFormComponent implements OnInit, OnChanges, OnDestroy {
	@Input() entityType: any;
	@Input() contentFields: any[];
	@Input() workflows: any[];

	@Output() formChange: EventEmitter<any> = new EventEmitter<any>();

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public openFields = {};
	public fieldsIdentifier = uuid.v4();

	constructor(
		private dialog: MatDialog,
		private formBuilder: FormBuilder,
		private dragulaService: DragulaService,
	) {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			icon: ['', Validators.required],
			slug: ['', Validators.required],
			fields: this.formBuilder.array([])
		});

		this.form.get('name').valueChanges
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => this.form.patchValue({
				slug: slugify(value).toLowerCase()
			}));
	}

	public ngOnInit(): void {
		this.dragulaService.createGroup(this.fieldsIdentifier, {
			moves: (el, container, handle) => {
				return el.querySelector(':scope > * > div > div > div > .m-field__handle-bar') === handle;
			}
		});

		this.form.valueChanges
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((values) => this.formChange.emit(values));
	}

	public ngOnChanges(changes: any) {
		if (!changes.entityType) {
			return;
		}

		const entityType = changes.entityType.currentValue;
		this.form.patchValue({
			...entityType,
			workflow: pathOr('', ['workflow', 'uuid'])(entityType)
		});

		const fieldsGroup = this.form.get('fields') as FormArray;
		this.buildFieldsArray((propOr([], 'fields')(entityType) as any[])).map((formGroup) => {
			fieldsGroup.push(formGroup);
		});
	}

	public findFieldConfiguration(identifier) {
		return this.contentFields.find((x) => x.identifier === identifier);
	}

	public handleFieldsUpdate(newFieldsOrder: any[], subfieldIndex?: number) {
		if (subfieldIndex !== undefined) {
			return this.rebuildFieldsArray((this.form.get('fields') as FormArray).at(0).get('subfields') as FormArray, newFieldsOrder);
		}

		this.rebuildFieldsArray(this.form.get('fields') as FormArray, newFieldsOrder);
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
				subfields: this.formBuilder.array(this.buildFieldsArray(field.subfields || []))
			});

			if (!field.slug) {
				fieldForm.get('name').valueChanges
					.pipe(
						takeUntil(this.componentDestroyed$)
					).subscribe((value) => fieldForm.patchValue({
						slug: camelCase(value)
					}));
			}

			return fieldForm;
		});
	}

	public removeField(i: number, subfieldIndex?: number) {
		const fieldsGroup = this.form.get('fields') as FormArray;

		if (subfieldIndex !== undefined) {
			return (fieldsGroup.at(subfieldIndex).get('subfields') as FormArray).removeAt(i);
		}

		fieldsGroup.removeAt(i);
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

	public pushFieldToArray(field, subfieldIndex?: number): void {
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
			subfields: this.formBuilder.array([])
		});

		fieldForm.get('name').valueChanges
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => fieldForm.patchValue({
				slug: camelCase(value)
			}));

		if (subfieldIndex !== undefined) {
			return ((this.form.get('fields') as FormArray).at(subfieldIndex).get('subfields') as FormArray).push(fieldForm);
		}

		(this.form.get('fields') as FormArray).push(fieldForm);
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}

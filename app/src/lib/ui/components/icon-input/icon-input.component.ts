import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { IconSelectModalComponent } from '../../modals';
import { icons } from './icon-input.const';

@Component({
    selector: 'app-icon-input',
    templateUrl: './icon-input.component.html',
    providers: [
        {
            provide: [],
            useExisting: forwardRef(() => IconInputComponent),
            multi: true,
        },
    ],
})
export class IconInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() label?: string;

    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    public control: FormControl = new FormControl('');
    public updateValue = (_: any) => {};

    constructor(
        public ngControl: NgControl,
        private dialog: MatDialog,
    ) {
        ngControl.valueAccessor = this;
    }

    public openModal() {
        const dialogRef = this.dialog.open(IconSelectModalComponent, {
            data: {
                icons,
            }
        });

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.componentDestroyed$)
            )
            .subscribe((value) => {
                if (!value) {
                    return;
                }

                this.control.setValue(value);
            });
    }

    private propagateChange(value: any): void {
        if (this.updateValue) {
            return this.updateValue(value);
        }

        if (this.control) {
            this.control.setValue(value);
        }
    }

    public ngOnInit() {
        this.control.valueChanges.pipe(
            takeUntil(this.componentDestroyed$),
        ).subscribe((value) => {
            this.propagateChange(value);
        });
    }

    public ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    public writeValue(value: any) {
        setTimeout(() => this.control.setValue(value));
    }

    public registerOnChange(fn: any) {
        this.updateValue = fn;
    }

    public registerOnTouched() {}
}

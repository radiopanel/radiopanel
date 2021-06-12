import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { pathOr } from 'ramda';
import { MatDialog } from '@angular/material/dialog';
import { ContentFieldSelectorModalComponent } from '../../modals';
import { first } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';

@Component({
    selector: 'app-repeater-config',
    templateUrl: 'repeater-config.component.html',
})
export class RepeaterConfigComponent implements OnInit {
    @Input() open = false;
    @Input() item: any;
    @Input() contentFields: any;

    @Output() remove: EventEmitter<void> = new EventEmitter<void>();
    @Output() subfieldRemove: EventEmitter<number> = new EventEmitter<number>();
    @Output() subfieldAdd: EventEmitter<any> = new EventEmitter<any>();
    @Output() toggleOpen: EventEmitter<void> = new EventEmitter<void>();
    @Output() subfieldsChange: EventEmitter<any> = new EventEmitter<any>();

    public openFields = {};

    constructor(
        private dialog: MatDialog,
        private dragulaService: DragulaService
    ) {}

    public ngOnInit(): void {
        this.dragulaService.createGroup('subfields', {
            moves: (el, container, handle) => {
                return el.querySelector(':scope > * > div > div > div > .m-field__handle-bar') === handle;
            }
        });
    }

    public findFieldConfiguration(identifier) {
        return this.contentFields.find((x) => x.identifier === identifier);
    }

    public toggleSubfieldExpansion(i: number) {
        this.openFields[i] = !pathOr(false, [i])(this.openFields);
    }

    public toggleFieldExpansion(e: Event) {
        e.preventDefault();
        this.toggleOpen.emit();
    }

    public selectContentField(): void {
        const dialogRef = this.dialog.open(ContentFieldSelectorModalComponent);

        dialogRef.afterClosed()
            .pipe(
                first()
            )
            .subscribe((value) => {
                if (!value) {
                    return;
                }

                this.subfieldAdd.emit(value);
            });
    }

    public removeSelf(e: Event) {
        e.preventDefault();
        this.remove.emit();
    }

    public handleDrop(items) {
        this.subfieldsChange.emit(items);
    }

    public removeSubfield(index: number) {
        this.subfieldRemove.emit(index);
    }
}

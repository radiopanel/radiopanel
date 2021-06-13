import { MomentModule } from 'ngx-moment';
import { DragulaModule } from 'ng2-dragula';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JoditAngularModule } from 'jodit-angular';
import { NgSelectModule } from '@ibsys/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

import { Components } from './components';
import { Modals } from './modals';
import { Pipes } from './pipes';
import { Services } from './services';
import { Directives } from './directives';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { Forms } from './forms';

@NgModule({
	declarations: [
		Components,
		Pipes,
		Modals,
		Directives,
		Forms,
	],
	imports: [
		DragDropModule,
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		MatDialogModule,
		MomentModule,
		NgSelectModule,
		JoditAngularModule,
		TooltipModule,
		DragulaModule,
		NgScrollbarModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		MonacoEditorModule.forRoot(),
	],
	exports: [
		Components,
		Pipes,
		Modals,
		Directives,
		Forms,
	],
	entryComponents: [
		Modals
	],
	providers: [
		Services,
	],
})
export class UiModule { }

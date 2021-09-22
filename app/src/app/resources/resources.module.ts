import { MomentModule } from 'ngx-moment';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '../../lib/ui/ui.module';
import { Components } from './components';
import { Pages } from './pages';
import { ResourcesRoutingModule } from './resources-routing.module';

@NgModule({
    declarations: [
        Components,
        Pages
    ],
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        RouterModule,
        UiModule,
        ReactiveFormsModule,
        MomentModule,
        MatDialogModule
    ]
})
export class ResourcesModule { }

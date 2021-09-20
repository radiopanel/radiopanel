import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';

const routes: Routes = [
    {
        path: '',
        component: Pages.ListPageComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourcesRoutingModule { }

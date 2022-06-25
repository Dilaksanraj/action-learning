import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaintenanceComponent } from './maintenance.component';

const routes = [
    {
        path     : '',
        component: MaintenanceComponent
    }
];

@NgModule({
    declarations: [
        MaintenanceComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        FuseSharedModule
    ]
})
export class MaintenanceModulee
{
}

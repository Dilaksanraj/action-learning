import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { ClientLoginComponent } from './client-login.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

const routes = [
    {
        path     : 'login',
        component: ClientLoginComponent,
        // resolve:
        // {
        //     branch: LoginService
        // }
    },
    
];

@NgModule({
    declarations: [
        ClientLoginComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        NzButtonModule
    ],
    // providers: [
    //     LoginService
    // ]
})
export class ClientLoginModule
{
}

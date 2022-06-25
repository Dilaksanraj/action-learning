import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from 'app/main/pages/authentication/login/login.component';
import { LoginService } from './service/login.service';

const routes = [
    {
        path     : 'auth/login',
        component: LoginComponent,
        // resolve:
        // {
        //     branch: LoginService
        // }
    },
    
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ],
    // providers: [
    //     LoginService
    // ]
})
export class LoginModule
{
}

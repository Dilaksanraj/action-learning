import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { FuseSharedModule } from '@fuse/shared.module';


import { RouteGuard } from 'app/shared/guard/route.guard';
import { InvitationAuthComponent } from './invitation.component';
import { InvitationAuthService } from './invitation.service';

const routes = [
    {
        path: 'invitation-auth',
        // canActivate: [
        //     RouteGuard
        // ],
        component: InvitationAuthComponent,
        resolve:
        {
            invitation: InvitationAuthService
        }
    }
];

@NgModule({
    declarations: [
        InvitationAuthComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        FuseSharedModule,

        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,

        NzButtonModule,
        NzInputModule,
        NzCheckboxModule,
        NzFormModule,
        NzDatePickerModule,
    ],
    providers: [
        InvitationAuthService
    ]
})
export class InvitationAuthModule {
}

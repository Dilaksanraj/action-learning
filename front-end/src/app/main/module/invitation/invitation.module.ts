import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import {
    NzPaginationModule,
    NzRadioModule,
    NzDropDownModule,
    NzLayoutModule,
    NzAvatarModule,
    NzGridModule,
    NzTimePickerModule, NzInputNumberModule, NzTableModule, NzDividerModule
} from 'ng-zorro-antd';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { TranslateModule } from '@ngx-translate/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { FuseSharedModule } from '@fuse/shared.module';
// import { RyTimePickerModule } from 'app/shared/components/ry-time-picker/ry-time-picker.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FuseDemoModule } from '@fuse/components';
import { InvitationComponent } from './invitation.component';
import { NewOrEditComponentInvitation } from './dialog/new-or-edit/new-or-edit.component';
import { InvitationService } from './invitation.service';
import { IntakeService } from '../intake/service/intake.service';
import { Departmentservice } from '../department/service/department.service';
import { CommonService } from 'app/shared/service/common.service';
import { AuthGuard } from 'app/shared/guard/auth.guard';


const routes = [
    {
        path     : '',
        component: InvitationComponent,
        canActivate:
        [
            AuthGuard
        ],
        resolve:
        {
            invitation: InvitationService
        }
    },
    
];

@NgModule({
    declarations: [
        InvitationComponent,
        NewOrEditComponentInvitation
    ],
    entryComponents: [
        NewOrEditComponentInvitation
      ],

    imports     : [
        RouterModule.forChild(routes),

        NzPaginationModule,
        TranslateModule,
        FuseSharedModule,
        FuseDemoModule,

        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,

        NzFormModule,
        NzCardModule,
        NzListModule,
        NzEmptyModule,
        NzButtonModule,
        NzIconModule,
        NzInputModule,
        NzCheckboxModule,
        NzCollapseModule,
        NzSpinModule,
        NzSwitchModule,
        NzRadioModule,
        NzSelectModule,
        NzDropDownModule,
        NzLayoutModule,
        NzAvatarModule,
        NzGridModule,
        NzAlertModule,
        NzBadgeModule,
        NzToolTipModule,
        NzTimePickerModule,
        NzInputNumberModule,
        NzDatePickerModule,
        NzTableModule,
        NzDividerModule,
    ],
    providers: [
        InvitationService,
        IntakeService,
        Departmentservice,
        CommonService,
    ]
})
export class InvitationModule
{
}

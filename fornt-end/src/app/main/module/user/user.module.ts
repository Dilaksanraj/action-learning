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
    NzTimePickerModule, NzInputNumberModule, NzDatePickerModule, NzTableModule, NzDividerModule
} from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { TranslateModule } from '@ngx-translate/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { UserComponent } from './user.component';

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


const routes = [
    {
        path     : '',
        component: UserComponent,
        // resolve:
        // {
        //     branch: LoginService
        // }
    },
    
];

@NgModule({
    declarations: [
        UserComponent
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
    // providers: [
    //     LoginService
    // ]
})
export class UserModule
{
}

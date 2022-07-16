import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Department } from 'app/main/module/department/model/department.model';
import { Intake } from 'app/main/module/intake/model/intake.model';
import { AppConst } from 'app/shared/AppConst';
import { CommonService } from 'app/shared/service/common.service';
import { valueExists } from 'app/shared/validators/asynValidator';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { InvitationService } from '../../invitation.service';

@Component({
    selector: 'app-new-or-edit',
    templateUrl: './new-or-edit.component.html',
    styleUrls: ['./new-or-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewOrEditComponentInvitation implements OnInit {

    private _unsubscribeAll: Subject<any>;
    invitationForm: FormGroup;
    editMode: boolean;
    dialogTitle: string;
    buttonLoader: boolean;
    intakes: Intake[];
    departments: Department[];

    constructor(
        private _invitationService: InvitationService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<NewOrEditComponentInvitation>,
        private _commonService: CommonService,
    ) {

        this.invitationForm = this.createinvitationForm();
        this.editMode = _data.action === AppConst.modalActionTypes.NEW ? false : true;
        this.intakes = _data.intakes;
        this.departments = _data.departments;
        this.dialogTitle = this.editMode ? 'Update Invitation' : 'New Invitation';
        console.log(_data);
        this._unsubscribeAll = new Subject();

    }
    ngOnInit() {
    }

    createinvitationForm(): FormGroup {
        return new FormGroup({
            email: new FormControl(this.editMode ? '' : '', [
                Validators.required, Validators.email], [valueExists(this._commonService, 'invitation.email')]),
            expiry_date: new FormControl(this.editMode ? '' : '', [Validators.required]),
            type: new FormControl(this.editMode ? '' : '', [Validators.required]),
            intake: new FormControl(this.editMode ? '' : '', [Validators.required]),
            department: new FormControl(this.editMode ? '' : '', [Validators.required]),
        });
    }

    get fc(): any {
        return this.invitationForm.controls;
    }

    onFormSubmit(e: MouseEvent): void {
        e.preventDefault();

        if (this.invitationForm.invalid) {
            return;
        }

        const sendObj = {
            email: this.fc.email.value,
            expiry_date: DateTimeHelper.getUtcDate(this.fc.expiry_date.value),
            type: this.fc.type.value,
            intake: this.fc.intake.value,
            department: this.fc.department.value
        };

        console.log('[invitation object]', sendObj);

        this.buttonLoader = true;

        setTimeout(() => {
            this.buttonLoader = false;
        }, 1000);

        this._invitationService
        .storeInvitation(sendObj)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => setTimeout(() => this.buttonLoader = false, 200))
            )
            .subscribe(
                res => {
                    this.resetForm(null);

                    setTimeout(() => this.matDialogRef.close(res), 250);
                },
                error => {
                    throw error;
                },
                () => {
                    console.log('😀 all good. 🍺');
                }
            );
    }

    trackByFn(index: number, item: any): number {
        return index;
    }

    // setAsyncValidators(): void
    //   {
    //       setTimeout(() =>
    //       {
    //           this.invitationForm.get('email').setAsyncValidators([this.emailExistsValidator(this.editMode ? this._data.response.invitation.id : '')]);
    //       }, 500);
    //   }

    // emailExistsValidator(id: string = ''): AsyncValidatorFn
    // {
    //     return (control: AbstractControl) => control
    //         .valueChanges
    //         .pipe(
    //             debounceTime(800),
    //             distinctUntilChanged(),
    //             switchMap(() => this._invitationService.emailExists(control.value, id)),
    //             map((unique: boolean) => (!unique ? null : { 'exists': true })),
    //             catchError(() => of({ 'exists': true })),
    //             first()
    //         );
    // }


    resetForm(e: MouseEvent): void {

        if (e) { e.preventDefault(); }

        this.invitationForm.reset();
    }


}

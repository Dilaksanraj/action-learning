import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAddDialogComponent } from 'app/main/module/user/dialog/new/new.component';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, first, map, takeUntil, finalize } from 'rxjs/operators';
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
  dialogTitle: string
  buttonLoader:boolean;

  constructor(
    private _invitationService: InvitationService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<UserAddDialogComponent>,
  ) 
  {
    this.dialogTitle = "New Invitation"
    this.invitationForm = this.createinvitationForm();
    this.editMode = false;
  }
  ngOnInit() {
  }

  createinvitationForm(): FormGroup
  {
      return new FormGroup({
          email: new FormControl(this.editMode ? '' : '', [
              Validators.required, Validators.email], []),
              expiry_date:new FormControl(this.editMode ? '' : '', [Validators.required]),
          type: new FormControl(this.editMode ? '' : '', [Validators.required]),
          });
  }

  get fc(): any 
  { 
      return this.invitationForm.controls; 
  }

  onFormSubmit(e: MouseEvent): void
  {
      e.preventDefault();

      if (this.invitationForm.invalid)
      {
          return;
      }

      const sendObj = {
          email: this.fc.email.value,
          expiry_date: DateTimeHelper.getUtcDate(this.fc.expiry_date.value),
          type: this.fc.type.value,
      };

      console.log('[branch object]', sendObj);

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
              res =>
              {
                  this.resetForm(null);

                  setTimeout(() => this.matDialogRef.close(res), 250);
              },
              error =>
              {
                  throw error;
              },
              () =>
              {
                  console.log('😀 all good. 🍺');
              }
          );
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


    resetForm(e: MouseEvent): void
    {
        if (e) { e.preventDefault(); }

        this.invitationForm.reset();
    }
  

}

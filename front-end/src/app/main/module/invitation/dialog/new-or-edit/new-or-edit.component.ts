import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAddDialogComponent } from 'app/main/module/user/dialog/new/new.component';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, first, map } from 'rxjs/operators';
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

  constructor(
    private _invitationService: InvitationService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<UserAddDialogComponent>,
  ) 
  {
    console.log('opened');
    
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
          type: new FormControl(this.editMode ? '' : '', [Validators.required]),
          });
  }

  onFormSubmit(e: MouseEvent): void
  {
      e.preventDefault();

      if (this.invitationForm.invalid)
      {
          return;
      }

      // const sendObj = {
      //     name: this.fc.name.value,
      //     email: this.fc.email.value,
      //     domain: this.fc.domain.value,
      //     desc: this.fc.desc.value,
      //     status: this.fc.status.value,
      //     country: this.fc.country.value,
      //     timezone: this.fc.timezone.value,
      //     service: this.fc.service.value,
      //     open_days: this.openHourMap,
      //     pincode: this.fc.pincode.value
      // };

      // this._logger.debug('[branch object]', sendObj);

      // this.buttonLoader = true;

      // this._branchService
      //     .storeBranch(sendObj)
      //     .pipe(
      //         takeUntil(this._unsubscribeAll),
      //         finalize(() => setTimeout(() => this.buttonLoader = false, 200))
      //     )
      //     .subscribe(
      //         res =>
      //         {
      //             this.resetForm(null);

      //             setTimeout(() => this.matDialogRef.close(res), 250);
      //         },
      //         error =>
      //         {
      //             throw error;
      //         },
      //         () =>
      //         {
      //             this._logger.debug('😀 all good. 🍺');
      //         }
      //     );
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
  

}

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InvitationService } from 'app/main/module/invitation/invitation.service';
import { UserAddDialogComponent } from 'app/main/module/user/dialog/new/new.component';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { IntakeService } from '../../service/intake.service';

@Component({
  selector: 'app-new-or-edit',
  templateUrl: './new-or-edit.component.html',
  styleUrls: ['./new-or-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntakeNewOrEditComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  intakeForm: FormGroup;
  editMode: boolean;
  dialogTitle: string
  buttonLoader: boolean;

  constructor(
    private _invitationService: IntakeService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<UserAddDialogComponent>,
  ) {
    this.dialogTitle = "New Intake"
    this.intakeForm = this.createintakeForm();
    this.editMode = false;
  }
  ngOnInit() {
  }

  createintakeForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(this.editMode ? '' : '', [
        Validators.required], []),
      code: new FormControl(this.editMode ? '' : '', [Validators.required]),
      graduation_year: new FormControl(this.editMode ? '' : '', [Validators.required]),
    });
  }

  get fc(): any {
    return this.intakeForm.controls;
  }

  onFormSubmit(e: MouseEvent): void {
    e.preventDefault();

    if (this.intakeForm.invalid) {
      return;
    }

    const sendObj = {
      name: this.fc.name.value,
      graduation_year: DateTimeHelper.getUtcDate(this.fc.graduation_year.value),
      code: this.fc.code.value,
    };

    console.log('[intake object]', sendObj);

    this.buttonLoader = true;

    setTimeout(() => {
      this.buttonLoader = false;
    }, 1000);

    this._invitationService
      .storeIntake(sendObj)
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

  // setAsyncValidators(): void
  //   {
  //       setTimeout(() =>
  //       {
  //           this.intakeForm.get('email').setAsyncValidators([this.emailExistsValidator(this.editMode ? this._data.response.invitation.id : '')]);
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

    this.intakeForm.reset();
  }


}
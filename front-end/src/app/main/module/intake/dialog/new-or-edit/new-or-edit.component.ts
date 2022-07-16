import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppConst } from 'app/shared/AppConst';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Intake } from '../../model/intake.model';
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
  dialogTitle: string;
  buttonLoader: boolean;
  intake: Intake;
  action: string;

  constructor(
    private intakeService: IntakeService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<IntakeNewOrEditComponent>,
  ) {

    this.action = _data.action;
    this.editMode = this.action === AppConst.modalActionTypes.EDIT? true: false;
    this.dialogTitle =  this.editMode? "Edit Intake" : "New Intake"
    this.intake = this.editMode? this._data.intake : '';

    this.intakeForm = this.createintakeForm();
    this._unsubscribeAll = new Subject();
    
  }
  ngOnInit() {
  }

  createintakeForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(this.editMode ? this.intake.name : '', [
        Validators.required], []),
      code: new FormControl(this.editMode ? this.intake.code : '', [Validators.required]),
      graduation_year: new FormControl(this.editMode ? DateTimeHelper.parseMomentDate(this.intake.graduationYear) : '', [Validators.required]),
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

    if (this.editMode) { sendObj['id'] = this.intake.id; }

    console.log('[intake object]', sendObj);

    this.buttonLoader = true;

    setTimeout(() => {
      this.buttonLoader = false;
    }, 1000);

    this.intakeService[this.editMode ? 'updateIntake' : 'storeIntake'](sendObj)
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
  //             switchMap(() => this.intakeService.emailExists(control.value, id)),
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
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Department } from 'app/main/module/department/model/department.model';
import { Departmentservice } from 'app/main/module/department/service/department.service';
import { AppConst } from 'app/shared/AppConst';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-new-or-edit-department',
  templateUrl: './new-or-edit-department.component.html',
  styleUrls: ['./new-or-edit-department.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewOrEditDepartmentComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  departmentForm: FormGroup;
  editMode: boolean;
  dialogTitle: string;
  buttonLoader: boolean;
  department: Department;
  action: string;

  constructor(
    private departmentService: Departmentservice,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<NewOrEditDepartmentComponent>,
  ) {

    this.action = _data.action;
    this.editMode = this.action === AppConst.modalActionTypes.EDIT ? true : false;
    this.dialogTitle =  this.editMode ? 'Edit department' : 'New department';
    this.department = this.editMode ? this._data.item : '';

    this.departmentForm = this.createDepartmentForm();
    this._unsubscribeAll = new Subject();

    console.log(_data);
    
    
  }
  ngOnInit() {
  }

  createDepartmentForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(this.editMode ? this.department.name : '', [
        Validators.required], []),
      code: new FormControl(this.editMode ? this.department.code : '', [Validators.required]),
    });
  }

  get fc(): any {
    return this.departmentForm.controls;
  }

  onFormSubmit(e: MouseEvent): void {
    e.preventDefault();

    if (this.departmentForm.invalid) {
      return;
    }

    const sendObj = {
      name: this.fc.name.value,
      code: this.fc.code.value,
      id: this.editMode ? this.department.id : ''
    };

    if (this.editMode) { sendObj['id'] = this.department.id; }

    console.log('[department object]', sendObj);

    this.buttonLoader = true;

    setTimeout(() => {
      this.buttonLoader = false;
    }, 1000);

    this.departmentService[this.editMode ? 'updateDepartment' : 'storeDepartment'](sendObj)
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
  //           this.departmentForm.get('email').setAsyncValidators([this.emailExistsValidator(this.editMode ? this._data.response.invitation.id : '')]);
  //       }, 500);
  //   }

  // emailExistsValidator(id: string = ''): AsyncValidatorFn
  // {
  //     return (control: AbstractControl) => control
  //         .valueChanges
  //         .pipe(
  //             debounceTime(800),
  //             distinctUntilChanged(),
  //             switchMap(() => this.departmentService.emailExists(control.value, id)),
  //             map((unique: boolean) => (!unique ? null : { 'exists': true })),
  //             catchError(() => of({ 'exists': true })),
  //             first()
  //         );
  // }


  resetForm(e: MouseEvent): void {
    if (e) { e.preventDefault(); }

    this.departmentForm.reset();
  }


}

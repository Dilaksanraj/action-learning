import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'user-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserAddDialogComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  branchForm: FormGroup;
  editMode: boolean;

  constructor(
    public matDialogRef: MatDialogRef<UserAddDialogComponent>,
  ) 
  {
    console.log('opened');
    
    this.branchForm = this.createBranchForm();
    this.editMode = false;
  }

  ngOnInit() {
  }

  createBranchForm(): FormGroup
  {
      return new FormGroup({
          name: new FormControl(this.editMode ? '' : '', [
              Validators.required], []),
          email: new FormControl(this.editMode ? '' : '', [Validators.required, Validators.email]),
          });
  }

  onFormSubmit(e: MouseEvent): void
  {
      e.preventDefault();

      if (this.branchForm.invalid)
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

}

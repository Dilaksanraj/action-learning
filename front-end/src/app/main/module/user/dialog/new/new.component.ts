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
  userForm: FormGroup;
  editMode: boolean;

  constructor(
    public matDialogRef: MatDialogRef<UserAddDialogComponent>,
  ) 
  {
    console.log('opened');
    
    this.userForm = this.createUserForm();
    this.editMode = false;
  }

  ngOnInit() {
  }

  createUserForm(): FormGroup
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

      if (this.userForm.invalid)
      {
          return;
      }

      
  }

}

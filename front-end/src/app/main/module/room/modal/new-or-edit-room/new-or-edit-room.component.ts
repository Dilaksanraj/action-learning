import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Department } from 'app/main/module/department/model/department.model';
import { Intake } from 'app/main/module/intake/model/intake.model';
import { IntakeService } from 'app/main/module/intake/service/intake.service';
import { Project } from 'app/main/module/project/modal/project.modal';
import { User } from 'app/main/module/user/user.model';
import { AppConst } from 'app/shared/AppConst';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { logWarnings } from 'protractor/built/driverProviders';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Room } from '../../room.model';
import { RoomService } from '../../room.service';

@Component({
  selector: 'app-new-or-edit-room',
  templateUrl: './new-or-edit-room.component.html',
  styleUrls: ['./new-or-edit-room.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewOrEditRoomComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  intakeForm: FormGroup;
  editMode: boolean;
  dialogTitle: string;
  buttonLoader: boolean;
  departments: Department[];
  project: Project[];
  user: User[];
  students: User[];
  filterStudent: User[];
  intakes: Intake[];
  room: Room;
  action: string;
  
  constructor(
    private _roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<NewOrEditRoomComponent>,
  ) { 
    this.action = _data.action;
    this.editMode = this.action === AppConst.modalActionTypes.EDIT? true: false;
    this.dialogTitle =  this.editMode? "Edit Room" : "New Room"
    this.room = this.editMode? this._data.room : '';

    this.user = _data.staff;
    this.project = _data.project;
    this.departments = _data.dep;
    this.students = _data.students;
    this.intakes = _data.intake;
    this.filterStudent = this.students;

    this.intakeForm = this.createintakeForm();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.intakeForm
            .get('dep_id')
            .valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(value =>
            {
                console.log(value);
                this.updateForm();
                
            });

            this.intakeForm
            .get('intake_id')
            .valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(value =>
            {
                console.log(value);
                this.updateForm();
                
            });
  }

  updateForm(){
    if(this.fc.dep_id.value && this.fc.intake_id.value){

      this.intakeForm.get('stu_id').enable();
      this.intakeForm.get('stu_id').updateValueAndValidity();

      this.filterStudent = this.students.filter(e => (e.departments.id === this.fc.dep_id.value && e.intake.id === this.fc.intake_id.value));

      console.log('filter user', this.students);
      

    }

    else{
      this.intakeForm.get('stu_id').disable();
      this.intakeForm.get('stu_id').updateValueAndValidity();
      this.filterStudent = this.students;
    }
  }

  createintakeForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(this.editMode ? this.room.name : '', [
        Validators.required], []),
      project_id: new FormControl(this.editMode ? this.room.project : null, [Validators.required]),
      staff_id: new FormControl(this.editMode ? this.room.staff : null, [Validators.required]),
      desc: new FormControl(this.editMode ? this.room.desc : '', [Validators.required]),
      dep_id: new FormControl(this.editMode ? this.room.departments : null, [Validators.required]),
      stu_id: new FormControl({value: this.editMode ? this.room.status : null, disabled: true}, [Validators.required]),
      status: new FormControl(this.editMode? this.room.status : false, [Validators.required]),
      intake_id: new FormControl(this.editMode ? this.room.status : null, [Validators.required]),
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
      project_id: this.fc.project_id.value,

      staff_id: this.fc.staff_id.value,
      desc: this.fc.desc.value,

      dep_id: this.fc.dep_id.value,
      stu_id: this.fc.stu_id.value,

      status: this.fc.status.value,
      intake_id: this.fc.intake_id.value,
    };

    if (this.editMode) { sendObj['id'] = this.room.id; }

    console.log('[room object]', sendObj);

    this.buttonLoader = true;

    setTimeout(() => {
      this.buttonLoader = false;
    }, 1000);

    this._roomService[this.editMode ? 'updateRoom' : 'storeRoom'](sendObj)
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

  resetForm(e: MouseEvent): void {
    if (e) { e.preventDefault(); }

    this.intakeForm.reset();
  }

}

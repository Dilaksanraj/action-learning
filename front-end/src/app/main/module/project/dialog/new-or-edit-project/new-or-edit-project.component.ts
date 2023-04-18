import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Intake } from 'app/main/module/intake/model/intake.model';
import { IntakeService } from 'app/main/module/intake/service/intake.service';
import { NewOrEditRoomComponent } from 'app/main/module/room/modal/new-or-edit-room/new-or-edit-room.component';
import { AppConst } from 'app/shared/AppConst';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Project } from '../../modal/project.modal';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-new-or-edit-project',
  templateUrl: './new-or-edit-project.component.html',
  styleUrls: ['./new-or-edit-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewOrEditProjectComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  intakeForm: FormGroup;
  editMode: boolean;
  dialogTitle: string;
  buttonLoader: boolean;
  project: Project;
  action: string;
  
  constructor(
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<NewOrEditProjectComponent>,
  ) { 
    this.action = _data.action;
    this.editMode = this.action === AppConst.modalActionTypes.EDIT? true: false;
    this.dialogTitle =  this.editMode? "Edit Project" : "New Project"
    this.project = this.editMode? this._data.intake : '';

    this.intakeForm = this.createintakeForm();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
  }

  createintakeForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(this.editMode ? this.project.name : '', [
        Validators.required], []),
      desc: new FormControl(this.editMode ? this.project.desc : '', [Validators.required]),
      end_date: new FormControl(this.editMode ? this.project.endDate : '', [Validators.required]),
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
      end_date: DateTimeHelper.getUtcDate(this.fc.end_date.value),
      desc: this.fc.desc.value,
    };

    if (this.editMode) { sendObj['id'] = this.project.id; }

    console.log('[intake object]', sendObj);

    this.buttonLoader = true;

    setTimeout(() => {
      this.buttonLoader = false;
    }, 1000);

    this.projectService[this.editMode ? 'updateProject' : 'storeProject'](sendObj)
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

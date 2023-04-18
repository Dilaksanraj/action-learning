import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AppConst } from 'app/shared/AppConst';
import { NotifyMessageType } from 'app/shared/enum/notify-message.enum';
import { NotifyType } from 'app/shared/enum/notify-type.enum';
import { NzNotifyPosition } from 'app/shared/enum/nz-notify-position.enum';
import { NotificationService } from 'app/shared/service/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Department } from '../department/model/department.model';
import { Departmentservice } from '../department/service/department.service';
import { IntakeNewOrEditComponent } from '../intake/dialog/new-or-edit/new-or-edit.component';
import { Intake } from '../intake/model/intake.model';
import { IntakeService } from '../intake/service/intake.service';
import { Project } from '../project/modal/project.modal';
import { ProjectService } from '../project/service/project.service';
import { User } from '../user/user.model';
import { NewOrEditRoomComponent } from './modal/new-or-edit-room/new-or-edit-room.component';
import { Room } from './room.model';
import { RoomService } from './room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fuseAnimations,
    fadeInOnEnterAnimation({ duration: 300 }),
    fadeOutOnLeaveAnimation({ duration: 300 })
  ]
})
export class RoomComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  total: number;
  isLoadingData: boolean;
  rooms: Room[];

  pageIndex: any;
  pageSize: any = 1;
  pageSizeChanger = true;
  pageSizeOptions: number[];
  totalDisplay = 0;
  tableLoading = false;
  mobilePagination = false;
  today: any;
  dialogRef: any;
  confirmModal: NzModalRef;

  constructor(
    private _modalService: NzModalService,
    public _matDialog: MatDialog,
    private _notification: NotificationService,
    private _intakeService: IntakeService,
    private _departmentService: Departmentservice,
    private _projectService: ProjectService,
    private _roomService: RoomService
  ) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.rooms = [];
    this.total = 0;
    this.isLoadingData = true;
  }

  ngOnInit() {
    this._roomService
    .onRoomChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((room: Room[]) => {
        console.log('[room]', room);

        this.rooms = room;
    });
  }

  addDialog(e: MouseEvent): void {

    e.preventDefault();

    // get all dependency befor opening the modal

    Promise.all([

        this._departmentService.getAllDepartments(),
        this._projectService.getAllStaff(),
        this._projectService.getAllProject(),
        this._projectService.getAllStudent(),
        this._projectService.getAllIntakes(),
    ])
    .then(([departments, staff, projects, students, intakes]: [Department[], User[], Project[], User[], Intake[]])=> {

        if(departments.length < 1){
            setTimeout(() => this._notification.displayNotification(NotifyMessageType.WARNING,'Departments not found',NotifyMessageType.WARNING,1000,NzNotifyPosition.TOP_RIGHT), 200);

        }

        if(staff.length < 1){
            setTimeout(() => this._notification.displayNotification(NotifyMessageType.WARNING,'User not found',NotifyMessageType.WARNING,1000,NzNotifyPosition.TOP_RIGHT), 200);
        }

        if(Project.length < 1){
            setTimeout(() => this._notification.displayNotification(NotifyMessageType.WARNING,'Project not found',NotifyMessageType.WARNING,1000,NzNotifyPosition.TOP_RIGHT), 200);
        }

        if(students.length < 1){
            setTimeout(() => this._notification.displayNotification(NotifyMessageType.WARNING,'Students not found',NotifyMessageType.WARNING,1000,NzNotifyPosition.TOP_RIGHT), 200);
        }
        if(intakes.length < 1){
            setTimeout(() => this._notification.displayNotification(NotifyMessageType.WARNING,'Intakes not found',NotifyMessageType.WARNING,1000,NzNotifyPosition.TOP_RIGHT), 200);
        }

        this.dialogRef = this._matDialog
        .open(NewOrEditRoomComponent,
            {
                panelClass: 'room-new-dialog',
                closeOnNavigation: true,
                disableClose: true,
                autoFocus: false,
                data: {
                    action: AppConst.modalActionTypes.NEW,
                    dep: departments,
                    staff: staff,
                    project: projects,
                    students: students,
                    intake: intakes
                }
            });

    this.dialogRef
        .afterClosed()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(message => {
            if (!message) {
                return;
            }

            this._notification.clearSnackBar();

            setTimeout(() => this._notification.displaySnackBar(message, NotifyType.SUCCESS), 200);
        });

    });

    



    
}

editDialog(item: Intake, e: MouseEvent): void {
    e.preventDefault();

    this.dialogRef = this._matDialog
        .open(NewOrEditRoomComponent,
            {
                panelClass: 'room-new-dialog',
                closeOnNavigation: true,
                disableClose: true,
                autoFocus: false,
                data: {
                    action: AppConst.modalActionTypes.EDIT,
                    room: item
                }
            });

    this.dialogRef
        .afterClosed()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(message => {
            if (!message) {
                return;
            }

            this._notification.clearSnackBar();

            setTimeout(() => this._notification.displaySnackBar(message, NotifyType.SUCCESS), 200);
        });
}

delete(item: Intake, e: MouseEvent): void {
    e.preventDefault();

    this.confirmModal = this._modalService
        .confirm(
            {
                nzTitle: AppConst.dialogContent.DELETE.TITLE,
                nzContent: AppConst.dialogContent.DELETE.BODY,
                nzWrapClassName: 'vertical-center-modal',
                nzOkText: 'Yes',
                nzOkType: 'danger',
                nzOnOk: () => {

                    this._notification.displaySnackBar("Method not found", NotifyType.WARNING)                     
                    return new Promise((resolve, reject) => {
                        this._intakeService
                            .deleteIntake(item.id)
                            .pipe(
                                takeUntil(this._unsubscribeAll),
                                finalize(() => resolve())
                            )
                            .subscribe(
                                message => setTimeout(() => this._notification.displaySnackBar(message, NotifyType.SUCCESS), 200),
                                error => {
                                    throw error;
                                }
                            );
                    });
                }
            }
        );
}

ngOnDestroy(): void {

    // Close all dialogs
    this._matDialog.closeAll();

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
}

}

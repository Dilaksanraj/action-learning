import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AppConst } from 'app/shared/AppConst';
import { NotifyType } from 'app/shared/enum/notify-type.enum';
import { NotificationService } from 'app/shared/service/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { IntakeNewOrEditComponent } from '../intake/dialog/new-or-edit/new-or-edit.component';
import { Intake } from '../intake/model/intake.model';
import { IntakeService } from '../intake/service/intake.service';
import { NewOrEditProjectComponent } from './dialog/new-or-edit-project/new-or-edit-project.component';
import { Project } from './modal/project.modal';
import { ProjectService } from './service/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fuseAnimations,
    fadeInOnEnterAnimation({ duration: 300 }),
    fadeOutOnLeaveAnimation({ duration: 300 })
  ]
})
export class ProjectComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  total: number;
  isLoadingData: boolean;
  Project: Project[];

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
    private _projectService: ProjectService
  ) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.Project = [];
    this.total = 0;
    this.isLoadingData = true;
  }

  ngOnInit() {
    this._projectService
    .onProjectChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((intake: Project[]) => {
        console.log('[project]', intake);

        this.Project = intake;
    });
  }

  addDialog(e: MouseEvent): void {
    e.preventDefault();

    this.dialogRef = this._matDialog
        .open(NewOrEditProjectComponent,
            {
                panelClass: 'project-new-dialog',
                closeOnNavigation: true,
                disableClose: true,
                autoFocus: false,
                data: {
                    action: AppConst.modalActionTypes.NEW,
                    timezones: [],
                    countries: [],
                    providers: []
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

editDialog(item: Intake, e: MouseEvent): void {
    e.preventDefault();

    this.dialogRef = this._matDialog
        .open(NewOrEditProjectComponent,
            {
                panelClass: 'project-new-dialog',
                closeOnNavigation: true,
                disableClose: true,
                autoFocus: false,
                data: {
                    action: AppConst.modalActionTypes.EDIT,
                    intake: item
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
                    return new Promise((resolve, reject) => {
                        this._projectService
                            .deleteProject(item.id)
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

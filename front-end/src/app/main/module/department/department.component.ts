import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AppConst } from 'app/shared/AppConst';
import { NotifyType } from 'app/shared/enum/notify-type.enum';
import { NotificationService } from 'app/shared/service/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Intake } from '../intake/model/intake.model';
import { NewOrEditDepartmentComponent } from './dialog/new-or-edit-department/new-or-edit-department.component';
import { Department } from './model/department.model';
import { Departmentservice } from './service/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations,
        fadeInOnEnterAnimation({ duration: 300 }),
        fadeOutOnLeaveAnimation({ duration: 300 })
    ]
})
export class DepartmentComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
    total: number;
    isLoadingData: boolean;
    departments: Department[];

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
        private _departmentservice: Departmentservice,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.departments = [];
        this.total = 0;
        this.isLoadingData = true;
    }

    ngOnInit() {

        // Subscribe to branch changes
        this._departmentservice
            .onDepartmentChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((intake: Department[]) => {
                console.log('[intake]', intake);

                this.departments = intake;
            });

    }

    addDialog(e: MouseEvent): void {
        e.preventDefault();

        this.dialogRef = this._matDialog
            .open(NewOrEditDepartmentComponent,
                {
                    panelClass: 'department-new-dialog',
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

    editDialog(item: Department, e: MouseEvent): void {
        e.preventDefault();

        this.dialogRef = this._matDialog
            .open(NewOrEditDepartmentComponent,
                {
                    panelClass: 'department-new-dialog',
                    closeOnNavigation: true,
                    disableClose: true,
                    autoFocus: false,
                    data: {
                        action: AppConst.modalActionTypes.EDIT,
                        item: item
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

    delete(item: Department, e: MouseEvent): void {
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
                            this._departmentservice
                                .deleteDepartment(item.id)
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

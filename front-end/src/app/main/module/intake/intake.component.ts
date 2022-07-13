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
import { IntakeNewOrEditComponent } from './dialog/new-or-edit/new-or-edit.component';
import { Intake } from './model/intake.model';
import { IntakeService } from './service/intake.service';

@Component({
    selector: 'app-intake',
    templateUrl: './intake.component.html',
    styleUrls: ['./intake.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations,
        fadeInOnEnterAnimation({ duration: 300 }),
        fadeOutOnLeaveAnimation({ duration: 300 })
    ]
})
export class IntakeComponent implements OnInit {

    private _unsubscribeAll: Subject<any>;
    total: number;
    isLoadingData: boolean;
    intakes: Intake[];

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
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.intakes = [];
        this.total = 0;
        this.isLoadingData = true;
    }

    ngOnInit() {

        // Subscribe to branch changes
        this._intakeService
            .onIntakeChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((intake: Intake[]) => {
                console.log('[intake]', intake);

                this.intakes = intake;
            });

    }

    addDialog(e: MouseEvent): void {
        e.preventDefault();

        this.dialogRef = this._matDialog
            .open(IntakeNewOrEditComponent,
                {
                    panelClass: 'user-new-dialog',
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
            .open(IntakeNewOrEditComponent,
                {
                    panelClass: 'user-new-dialog',
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
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AppConst } from 'app/shared/AppConst';
import { NotifyType } from 'app/shared/enum/notify-type.enum';
import { NotificationService } from 'app/shared/service/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserAddDialogComponent } from './dialog/new/new.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations,
        fadeInOnEnterAnimation({ duration: 300 }),
        fadeOutOnLeaveAnimation({ duration: 300 })
    ]
})
export class UserComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;
  total: number;
  roomList: any;
  isLoadingData: boolean;

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
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.roomList = [];
    this.total = 0;
    this.isLoadingData = true;
   }

  ngOnInit() {
  }

  addDialog(e: MouseEvent): void
  {
      e.preventDefault();

      console.log("clicked")
      // this.buttonLoader = true;

          /*let sortTzList = []
          _.forEach(timezones, (tz, i) => _.merge(sortTzList, tz.zones));
          sortTzList = _.sortBy(sortTzList, ['value'])*/

          this.dialogRef = this._matDialog
              .open(UserAddDialogComponent,
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
              .subscribe(message =>
              {
                  if ( !message )
                  {
                      return;
                  }

                  this._notification.clearSnackBar();

                  setTimeout(() => this._notification.displaySnackBar(message, NotifyType.SUCCESS), 200);
              });
  }

  delete(e: MouseEvent): void
  {
      e.preventDefault();

      this.confirmModal = this._modalService
          .confirm(
              {
                  nzTitle: AppConst.dialogContent.DELETE.TITLE,
                  nzContent: AppConst.dialogContent.DELETE.BODY,
                  nzWrapClassName: 'vertical-center-modal',
                  nzOkText: 'Yes',
                  nzOkType: 'danger',
                  nzOnOk: () =>
                  {
                      // return new Promise((resolve, reject) =>
                      // {
                      //     this._branchService
                      //         .deleteBranch(item.id)
                      //         .pipe(
                      //             takeUntil(this._unsubscribeAll),
                      //             finalize(() => resolve())
                      //         )
                      //         .subscribe(
                      //             message => setTimeout(() => this._notification.displaySnackBar(message, NotifyType.SUCCESS), 200),
                      //             error =>
                      //             {
                      //                 throw error;
                      //             }
                      //         );
                      // });
                  }
              }
          );
  }

  ngOnDestroy(): void
  {

      // Close all dialogs
      this._matDialog.closeAll();

      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations,
    ]
})
export class UserComponent implements OnInit {

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

  constructor() {
    this.roomList = [];
    this.total = 0;
    this.isLoadingData = true;
   }

  ngOnInit() {
  }

}

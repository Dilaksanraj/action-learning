import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { shareReplay, map, takeUntil, finalize } from 'rxjs/operators';

import * as _ from 'lodash';
import { AuthService } from 'app/shared/service/auth.service';

import { AppConst } from 'app/shared/AppConst';
import { PaginationProp } from 'app/shared/interface/pagination';
import { SortProp } from 'app/shared/interface/sort';
import { Invitation } from '../invitation/model/invitation.model';
import { Room } from './room.model';

@Injectable()
export class RoomService implements Resolve<any>
{
    rooms: Room[];
    private _unsubscribeAll: Subject<any>;

    onRoomChanged: BehaviorSubject<any>;

    onPaginationChanged: Subject<PaginationProp>;
    onSearchTextChanged: Subject<any>;
    onSortChanged: Subject<SortProp>;
    onTableLoaderChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    defaultPageIndex: any = 1;
    defaultPageSize: any = 5;
    defaultPageSizeOptions: number[] = [5, 10, 20];

    totalRecords: number;
    totalDisplayRecords: number;
    isFiltered: boolean;
    pagination: any | null = null;
    filterBy: any | null = null;
    sortBy: any | null = null;
    searchText: string | null = null;

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    )
    {
        // Set the defaults
        this.totalRecords = 0;
        this.totalDisplayRecords = 0;
        this.isFiltered = false;
        this.rooms = [];

        this.onRoomChanged = new BehaviorSubject([]);
        
        this.onSearchTextChanged = new Subject();
        this.onSortChanged = new Subject();
        this.onPaginationChanged = new Subject();
        this.onTableLoaderChanged = new Subject();
        this.onFilterChanged = new Subject();

        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise<void>((resolve, reject) =>
        {
            Promise.all([
                this.getrooms()
            ])
            .then(([intakes]: [any]) => 
            {
                resolve();
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    getrooms(): Promise<any>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-room-list`, {})
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => 
                    {
                        console.log(response);
                        
                        this.rooms = response.map((i, idx) => new Room(i, idx));
                        this.onRoomChanged.next([...this.rooms]);
                        resolve();
                    },
                    reject
                );
        });
    }
    
    storeRoom(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/create-room`, data)
            .pipe(
                map(response => 
                    {
                        console.log(response);
                        
                        if (response.data && _.keys(response.data).length > 0)
                        {
                            console.log(response);
                            
                            const item = new Room(response.data);
                            item.isNew = true;
    
                            console.log(item);
                            
                            this.rooms = this.rooms.concat(item).map((v, i) =>
                            {
                                v.index = i;
                                return v;
                            });
    
                            setTimeout(() => this.onRoomChanged.next([...this.rooms]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    unsubscribeOptions(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // reinitialize 
        this._unsubscribeAll = new Subject();

        // reset all variables
        this.pagination = null;
        this.filterBy = null;
        this.sortBy = null;
        this.searchText = null;
        this.totalDisplayRecords = 0;
        this.totalRecords = 0;
        this.isFiltered = false;
    }

}

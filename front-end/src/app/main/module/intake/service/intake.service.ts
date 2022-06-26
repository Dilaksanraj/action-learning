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
import { Intake } from '../model/intake.model';

@Injectable()
export class IntakeService implements Resolve<any>
{
    private _unsubscribeAll: Subject<any>;

    private intake: Intake[];

    onInvitationChanged: BehaviorSubject<any>;
    onFilterBranchesChanged: BehaviorSubject<any>;

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

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {NGXLogger} _logger
     * @param {BranchService} _branchService
     * @param {AuthService} _authService
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    )
    {
        // Set the defaults
        this.totalRecords = 0;
        this.totalDisplayRecords = 0;
        this.isFiltered = false;

        this.onInvitationChanged = new BehaviorSubject([]);
        this.onFilterBranchesChanged = new BehaviorSubject([]);
        
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
        return new Promise((resolve, reject) =>
        {
            // if (this._authService.isOwner())
            // {
            //     Promise.all([
            //         this.getintake(),
            //         this.getBranches()
            //     ])
            //     .then(([intake, branches]: [any, any]) => 
            //     {
            //         this.setEvents(branches);
                    
            //         resolve();
            //     })
            //     .catch(error => 
            //     {
            //         reject(error);
            //     });
            // }
            // else if (this._authService.isAdministrative())
            // {
            //     Promise.all([
            //         this.getintake()
            //     ])
            //     .then(([intake]: [any]) => 
            //     {
            //         this.setEvents();

            //         resolve();
            //     })
            //     .catch(error => 
            //     {
            //         reject(error);
            //     });
            // }
            // else
            // {
            //     reject();    
            // }
        });
    }

    storeIntake(data: object): Observable<any>
    {
        console.log(data);
        
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/create-intake`, data)
            .pipe(
                map(response => response.message),
                shareReplay()
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

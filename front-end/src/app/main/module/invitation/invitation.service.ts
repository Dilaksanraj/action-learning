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
import { Invitation } from './model/invitation.model';

@Injectable()
export class InvitationService implements Resolve<any>
{
    private _unsubscribeAll: Subject<any>;

    private invitations: Invitation[];

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
        // private _branchService: BranchService,
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
        return new Promise<void>((resolve, reject) =>
        {
            Promise.all([
                this.getInvitation()
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

    getInvitation(): Promise<any>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-invitation-list`, {})
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => 
                    {
                        console.log(response);
                        
                        this.invitations = response.map((i, idx) => new Invitation(i, idx));
                        this.onInvitationChanged.next([...this.invitations]);
                        resolve();
                    },
                    reject
                );
        });
    }
    

    emailExists(email: string, index: string = ''): Observable<any>
    {
        const params = new HttpParams()
            .set('id', index)
            .set('value', email);

        return this._httpClient
            .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/invitation-email-exists`, { params })
            .pipe(
                map(response => response.data.found),
                shareReplay()
            );
    }

    /**
     * Create new invitation
     * 
     * @returns {Observable<any>}
     */
    // storeInvitation(data: object): Observable<any>
    // {
    //     console.log(data);
        
    //     return this._httpClient
    //         .post<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/create-invitation`, data)
    //         .pipe(
    //             map(response => response.message),
    //             shareReplay()
    //         );
    // }

    storeInvitation(data: object): Observable<any>
    {
        console.log('data in service' , data);
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/create-invitation`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                            const item = new Invitation(response.data);
                            item.isNew = true;
    
                            this.invitations = this.invitations.concat(item).map((v, i) =>
                            {
                                v.index = i;
                                return v;
                            });
    
                            setTimeout(() => this.onInvitationChanged.next([...this.invitations]), 350);
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

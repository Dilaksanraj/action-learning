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

@Injectable()
export class InvitationService implements Resolve<any>
{
    private _unsubscribeAll: Subject<any>;

    // private invitations: Invitation[];

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
        return new Promise((resolve, reject) =>
        {
            // if (this._authService.isOwner())
            // {
            //     Promise.all([
            //         this.getInvitations(),
            //         this.getBranches()
            //     ])
            //     .then(([invitations, branches]: [any, any]) => 
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
            //         this.getInvitations()
            //     ])
            //     .then(([invitations]: [any]) => 
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

    /**
     * set events after resolve
     */
    // setEvents(branches: Branch[] = []): void
    // {
    //     if (!_.isEmpty(branches))
    //     {
    //         this.onFilterBranchesChanged.next(branches);
    //     }

    //     this.onSearchTextChanged
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe(searchText =>
    //         {
    //             this.searchText = searchText;

    //             this.getInvitations();
    //         });

    //     this.onSortChanged
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe(sort =>
    //         {
    //             this.sortBy = sort;

    //             this.getInvitations();
    //         });

    //     this.onFilterChanged
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe(filter =>
    //         {
    //             this.filterBy = filter;

    //             // reset page index
    //             if (!_.isNull(this.pagination))
    //             {
    //                 this.pagination.page = this.defaultPageIndex;
    //             }

    //             this.getInvitations();
    //         });

    //     this.onPaginationChanged
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe(pagination =>
    //         {
    //             this.pagination = pagination;
                
    //             this.getInvitations();
    //         });
    // }

    /**
     * get branch list by user
     *
     * @returns {Promise<any>}
     */
    // getBranches(): Promise<any>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         this._branchService
    //             .getBranchesByUser()
    //             .pipe(
    //                 map(response => !_.isEmpty(response) ? response.map((i: any, idx: number) => new Branch(i, idx)) : [])
    //             )
    //             .subscribe((response: any) =>
    //                 {
    //                     resolve(response);
    //                 },
    //                 reject
    //             );
    //     });
    // }

    /**
     * get assign roles
     *
     * @param {string} id
     * @returns {Observable<any>}
     */
    // getRoles(id: string): Observable<any>
    // {
    //     const params = new HttpParams().set('id', id);

    //     return this._httpClient
    //         .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/get-invitation-roles`, { params })
    //         .pipe(
    //             map(response => response.data),
    //             shareReplay()
    //         );
    // }

    /**
     * Get invitation list
     *
     * @returns {Promise<any>}
     */
    // getInvitations(): Promise<any>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         // set table loader
    //         this.onTableLoaderChanged.next(true);

    //         if (_.isNull(this.pagination))
    //         {
    //             // set default value
    //             this.pagination = {
    //                 page: this.defaultPageIndex,
    //                 size: this.defaultPageSize
    //             };
    //         }

    //         const params = new HttpParams()
    //             .set('page', this.pagination.page)
    //             .set('offset', this.pagination.size)
    //             .set('search', this.searchText)
    //             .set('sort', JSON.stringify(this.sortBy))
    //             .set('filters', JSON.stringify(this.filterBy));
            
    //         return this._httpClient
    //             .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/get-invitation-list`, { params })
    //             .pipe(
    //                 map(response =>
    //                 {
    //                     this.invitations = response.data.map((i: any, idx: number) => new Invitation(i, idx));

    //                     this.totalDisplayRecords = response.meta ? response.meta.total : 0;
    //                     this.totalRecords = response.totalRecords;
    //                     this.isFiltered = response.filtered;

    //                     return {
    //                         items: (_.keys(response).length < 1 || (response.data && response.data.length < 1)) ? [] : [...this.invitations],
    //                         totalDisplay: this.totalDisplayRecords,
    //                         total: this.totalRecords,
    //                         filtered: this.isFiltered
    //                     };
    //                 }),
    //                 finalize(() => setTimeout(() => this.onTableLoaderChanged.next(false), 200)),
    //                 shareReplay()
    //             )
    //             .subscribe(
    //                 (response: any) =>
    //                 {
    //                     this.onInvitationChanged.next(response);

    //                     resolve();
    //                 },
    //                 reject
    //             );
    //     });
    // }

    /**
     * get invitation dependency
     *
     * @returns {Observable<any>}
     */
    // getDependency(): Observable<any>
    // {
    //     return this._httpClient
    //         .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/user-data`, {})
    //         .pipe(
    //             map(response =>
    //             {
    //                 if (response.data && _.keys(response.data).length < 1 || (response.data.roles.length < 1 || response.data.branches.length < 1 || response.data.rolelevels.length < 1))
    //                 {
    //                     return {};
    //                 }
    //                 else
    //                 {
    //                     return {
    //                         roles: response.data.roles.map((i: any, idx: number) => new Role(i, idx)),
    //                         branches: response.data.branches.map((i: any, idx: number) => new Branch(i, idx)),
    //                         levels: response.data.rolelevels
    //                     };
    //                 }
    //             }),
    //             shareReplay()
    //         );
    // }

    /**
     * check if email exists
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
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
    storeInvitation(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/create-invitation`, data)
            .pipe(
                map(response => response.message),
                shareReplay()
            );
    }

    /**
     * Get invitation item
     * 
     * @returns {Observable<any>}
     */
    // getInvitation(index: string): Observable<any>
    // {
    //     const params = new HttpParams().set('index', index);

    //     return this._httpClient
    //         .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/edit-invitation`, { params })
    //         .pipe(
    //             map(response => new Invitation(response.data)),
    //             shareReplay()
    //         );
    // }

    /**
     * Update invitation item
     * 
     * @returns {Observable<any>}
     */
    // updateInvitation(data: object): Observable<any>
    // {
    //     return this._httpClient
    //         .post<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/update-invitation`, data)
    //         .pipe(
    //             map(response => 
    //             {
    //                 if (response.data && _.keys(response.data).length > 0)
    //                 {
    //                     const item = new Invitation(response.data);
    
    //                     const index = this.invitations.findIndex((val) => val.id === item.id);

    //                     item.index = this.invitations[index].index;
    //                     this.invitations[index] = item;

    //                     setTimeout(() => this.onInvitationChanged.next(
    //                         {
    //                             items: [...this.invitations],
    //                             totalDisplay: this.totalDisplayRecords,
    //                             total: this.totalRecords,
    //                             filtered: this.isFiltered
    //                         }
    //                     ), 500);
    //                 }

    //                 return response.message;
    //             }),
    //             shareReplay()
    //         );
    // }

    // resendInvitation(id: string): Observable<any>
    // {
    //     this.onTableLoaderChanged.next(true);

    //     const params = new HttpParams().set('id', id);
        
    //     return this._httpClient
    //         .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/resend-invitation`, {params})
    //         .pipe(
    //             map(response => 
    //             {
    //                 if (response.data && _.keys(response.data).length > 0)
    //                 {
    //                     const item = new Invitation(response.data);
    
    //                     const index = this.invitations.findIndex((val) => val.id === item.id);

    //                     item.index = this.invitations[index].index;
    //                     this.invitations[index] = item;

    //                     setTimeout(() => this.onInvitationChanged.next(
    //                         {
    //                             items: [...this.invitations],
    //                             totalDisplay: this.totalDisplayRecords,
    //                             total: this.totalRecords,
    //                             filtered: this.isFiltered
    //                         }
    //                     ), 500);
    //                 }

    //                 return response.message;
    //             }),
    //             finalize(() => setTimeout(() => this.onTableLoaderChanged.next(false), 200)),
    //             shareReplay()
    //         );
    // }

    /**
     * Delete a invitation
     * 
     * @returns {Observable<any>}
     */
    // deleteInvitation(index: string): Observable<any>
    // {
    //     const params = new HttpParams().set('id', index);

    //     return this._httpClient
    //         .delete<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/delete-invitation`, { params })
    //         .pipe(
    //             map(response => response.message),
    //             shareReplay()
    //         );
    // }

    /**
     * Unsubscribe options
     */
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

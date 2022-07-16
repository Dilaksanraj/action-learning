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
import { Invitation } from '../../invitation/model/invitation.model';

@Injectable()
export class IntakeService implements Resolve<any>
{
    private _unsubscribeAll: Subject<any>;

    private intake: Intake[];

    onIntakeChanged: BehaviorSubject<any>;
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

        this.onIntakeChanged = new BehaviorSubject([]);
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
                this.getIntakes()
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

    storeIntake(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/create-intake`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                            const item = new Intake(response.data);
                            item.isNew = true;
    
                            this.intake = this.intake.concat(item).map((v, i) =>
                            {
                                v.index = i;
                                return v;
                            });
    
                            setTimeout(() => this.onIntakeChanged.next([...this.intake]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

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
    
                            // this.invitations = this.invitations.concat(item).map((v, i) =>
                            // {
                            //     v.index = i;
                            //     return v;
                            // });
    
                            // setTimeout(() => this.onInvitationChanged.next([...this.invitations]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    
    updateIntake(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/update-intake`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                        const item = new Intake(response.data);
                        
                        const index = this.intake.findIndex((val) => val.id === item.id);

                        item.isNew = true;
                        item.index = this.intake[index].index;

                        this.intake[index] = item;
    
                            setTimeout(() => this.onIntakeChanged.next([...this.intake]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    getIntakes(): Promise<any>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-intake-list`, {})
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => 
                    {
                        this.intake = response.map((i, idx) => new Intake(i, idx));
                        this.onIntakeChanged.next([...this.intake]);
                        resolve();
                    },
                    reject
                );
        });
    }

    getAllIntakes(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-intake-list`)
                .pipe(
                    map((response: any) => response.data.map((i, idx) => new Intake(i))),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
            
        });
    }

    deleteIntake(index: string): Observable<any>
    {
        const params = new HttpParams().set('id', index);

        return this._httpClient
            .delete<any>(`${AppConst.apiBaseUrl}/delete-intake`, { params })
            .pipe(
                map(response => 
                {
                    this.intake = this.intake.filter((i) => i.id !== index).map((v, i) =>
                    {
                        v.index = i;
                        return v;
                    });

                    setTimeout(() => this.onIntakeChanged.next([...this.intake]), 500);

                    return response.message;
                }),
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

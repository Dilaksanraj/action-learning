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
import { Invitation } from '../../invitation/model/invitation.model';
import { Project } from '../modal/project.modal';
import { User } from '../../user/user.model';
import { Intake } from '../../intake/model/intake.model';

@Injectable()
export class ProjectService implements Resolve<any>
{
    private _unsubscribeAll: Subject<any>;

    private project: Project[];

    onProjectChanged: BehaviorSubject<any>;

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

        this.onProjectChanged = new BehaviorSubject([]);
        
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
                this.getProject()
            ])
            .then(([project]: [any]) => 
            {
                resolve();
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    storeProject(data: object): Observable<any>
    {
        
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/create-project`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                            const item = new Project(response.data);
                            item.isNew = true;
    
                            this.project = this.project.concat(item).map((v, i) =>
                            {
                                v.index = i;
                                return v;
                            });
    
                            setTimeout(() => this.onProjectChanged.next([...this.project]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    
    updateProject(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/update-project`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                        const item = new Project(response.data);
                        
                        const index = this.project.findIndex((val) => val.id === item.id);

                        item.isNew = true;
                        item.index = this.project[index].index;

                        this.project[index] = item;
    
                            setTimeout(() => this.onProjectChanged.next([...this.project]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    getProject(): Promise<any>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-project-list`, {})
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => 
                    {
                        this.project = response.map((i, idx) => new Project(i, idx));
                        this.onProjectChanged.next([...this.project]);
                        resolve();
                    },
                    reject
                );
        });
    }

    getAllProject(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-project-list`)
                .pipe(
                    map((response: any) => response.data.map((i, idx) => new Project(i))),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
            
        });
    }

    getAllDepartment(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-all-departments`)
                .pipe(
                    map((response: any) => response.data.map((i, idx) => new Project(i))),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
            
        });
    }

    getAllStaff(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-all-staff`)
                .pipe(
                    map((response: any) => response.data.map((i, idx) => new User(i))),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
            
        });
    }

    getAllStudent(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-all-student`)
                .pipe(
                    map((response: any) => response.data.map((i, idx) => new User(i))),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
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

    deleteProject(index: string): Observable<any>
    {
        const params = new HttpParams().set('id', index);

        return this._httpClient
            .delete<any>(`${AppConst.apiBaseUrl}/delete-project`, { params })
            .pipe(
                map(response => 
                {
                    this.project = this.project.filter((i) => i.id !== index).map((v, i) =>
                    {
                        v.index = i;
                        return v;
                    });

                    setTimeout(() => this.onProjectChanged.next([...this.project]), 500);

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

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { shareReplay, map, takeUntil, finalize } from 'rxjs/operators';

import * as _ from 'lodash';
// import { AuthService } from 'app/shared/service/auth.service';

import { AppConst } from 'app/shared/AppConst';
import { PaginationProp } from 'app/shared/interface/pagination';
import { SortProp } from 'app/shared/interface/sort';
import { Department } from '../model/department.model';

@Injectable()
export class Departmentservice implements Resolve<any>
{
    private _unsubscribeAll: Subject<any>;

    private departments: Department[];

    onDepartmentChanged: BehaviorSubject<any>;

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
        // private _authService: AuthService
    )
    {
        // Set the defaults
        this.totalRecords = 0;
        this.totalDisplayRecords = 0;
        this.isFiltered = false;

        this.onDepartmentChanged = new BehaviorSubject([]);
        
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
                this.getDepartments()
            ])
            .then(([departments]: [any]) => 
            {
                resolve();
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    storeDepartment(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/create-department`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                            const item = new Department(response.data);
                            item.isNew = true;
    
                            this.departments = this.departments.concat(item).map((v, i) =>
                            {
                                v.index = i;
                                return v;
                            });
    
                            setTimeout(() => this.onDepartmentChanged.next([...this.departments]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    
    updateDepartment(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/update-department`, data)
            .pipe(
                map(response => 
                    {
                        if (response.data && _.keys(response.data).length > 0)
                        {
                        const item = new Department(response.data);
                        
                        const index = this.departments.findIndex((val) => val.id === item.id);

                        item.isNew = true;
                        item.index = this.departments[index].index;

                        this.departments[index] = item;
    
                            setTimeout(() => this.onDepartmentChanged.next([...this.departments]), 350);
                        }
    
                        return response.message;
                    }),
            );
    }

    getDepartments(): Promise<any>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-department-list`, {})
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => 
                    {
                        this.departments = response.map((i, idx) => new Department(i, idx));
                        this.onDepartmentChanged.next([...this.departments]);
                        resolve();
                    },
                    reject
                );
        });
    }

    getAllDepartments(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/get-department-list`)
                .pipe(
                    map((response: any) => response.data.map((i, idx) => new Department(i))),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
            
        });
    }

    deleteDepartment(index: string): Observable<any>
    {
        const params = new HttpParams().set('id', index);

        return this._httpClient
            .delete<any>(`${AppConst.apiBaseUrl}/delete-department`, { params })
            .pipe(
                map(response => 
                {
                    this.departments = this.departments.filter((i) => i.id !== index).map((v, i) =>
                    {
                        v.index = i;
                        return v;
                    });

                    setTimeout(() => this.onDepartmentChanged.next([...this.departments]), 500);

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

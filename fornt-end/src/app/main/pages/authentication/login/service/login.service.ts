import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppConst } from 'app/shared/AppConst';
@Injectable()
export class LoginService implements Resolve<any> {

    onBranchChanged: BehaviorSubject<any>;
    onBranchStatusChanged: Subject<any>;
    private branches: any[];

    

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {NGXLogger} _logger
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onBranchChanged = new BehaviorSubject([]);
        this.onBranchStatusChanged = new Subject();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise<void>((resolve, reject) =>
        {
            Promise.all([
                this.getBranches()
            ])
            .then(([branches]: [any]) => 
            {
                resolve();
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    getBranches(): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            console.log("function work");
            
            this._httpClient
            .get<any>(`https://api.publicapis.org/entries`,{})
                // .get<any>(`${AppConst.apiBaseUrl}/${AppConst.urlPrefix.APP}/get-branch-list`, {})
                .pipe(
                    map(response => response),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => 
                    {
                        console.log(response);
                        
                        // this.branches = response.map((i, idx) => new Branch(i, idx));
                        // this.onBranchChanged.next([...this.branches]);
                        resolve();
                    },
                    reject
                );
        });
    }

    

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import * as _ from 'lodash';

import { AppConst } from 'app/shared/AppConst';

import { InvitationVerify } from './Invitation.model';
import { User } from 'app/main/module/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class InvitationAuthService implements Resolve<any>
{
    onInvitationTokenVerified: BehaviorSubject<any>;
    queryParams: any;

    constructor(
        private _httpClient: HttpClient,

    )
    {
        // Set the defaults
        this.onInvitationTokenVerified = new BehaviorSubject([]);
    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.queryParams = route.queryParams;

        return new Promise((resolve, reject) =>
        {
            Promise.all([
                this.verifyInvitation(!_.isEmpty(this.queryParams) ? this.queryParams.token : null)
            ])
            .then(([invitation]: [any]) => 
            {
                resolve();
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    verifyInvitation(token: string): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            if (_.isNull(token))
            {
                this.onInvitationTokenVerified.next(null);
                resolve();
            }
            else
            {
                const params = new HttpParams().set('token', token);
    
                this._httpClient
                    .get<any>(`${AppConst.apiBaseUrl}/auth_verify_invitation`, { params })
                    .pipe(
                        map(response =>
                        {
                            if (!response.data || (response.data && _.keys(response.data).length < 1))
                            {
                                return null;
                            }
                            else
                            {
                                return new InvitationVerify(response.data);
                            }
                        }),
                        shareReplay()
                    )
                    .subscribe(
                        (response: InvitationVerify) => 
                        {
                            this.onInvitationTokenVerified.next(response);
                            
                            resolve();
                        },
                        reject
                    );
            }
        });
    }

    acceptInvitation(data: object): Observable<any>
    {
        return this._httpClient
            .post<any>(`${AppConst.apiBaseUrl}/auth_accept_invitation`, data)
            .pipe(
                map(response => response.message),
                shareReplay()
            );
    }


    getUserData(data: string): Observable<any>
    {
        const params = new HttpParams().set('user_email', data);

        return this._httpClient
            .get<any>(`${AppConst.apiBaseUrl}/get_user_data`, {params})
            .pipe(
                map(response => new User(response.data)),
                shareReplay()
            );
    }
}

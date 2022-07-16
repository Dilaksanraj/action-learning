import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild, Router } from '@angular/router';
import { of, Subscription  } from 'rxjs';
import { take, finalize, distinctUntilChanged, tap } from 'rxjs/operators';

import * as _ from 'lodash';

import { fromWorker } from 'observable-webworker';

import { AuthService } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';
import { NavigationService } from '../service/navigation.service';
import { CommonService } from './../service/common.service';

import { browserRefresh } from 'app/app.component';
import { NotifyType } from '../enum/notify-type.enum';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
    private authSubscription: Subscription;

    /**
     * Constructor
     * 
     * @param {Router} _router
     * @param {AuthService} _authService
     * @param {NGXLogger} _logger
     * @param {NotificationService} _notify
     * @param {NavigationService} _navService
     * @param {CommonService} _commonService
     */
    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _notify: NotificationService,
        private _navService: NavigationService,
        private _commonService: CommonService
    )
    {
        //
    }

    /**
     * Can activate
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {(Promise<boolean | UrlTree>)}
     */
    async canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Promise<boolean | UrlTree>
    {
        console.log('[is logged in]', this._authService.isAuthenticated());

        console.log('browser refreshed', browserRefresh);

        return new Promise(async (resolve) => 
        {
            try
            {

                if (!this._authService.isAuthenticated())
                {

                    this._authService.resolveUnauthorizedPath();
                    resolve(false);
                }
                else{

                    resolve(true);
                }

            }
            catch (err)
            {
                this._authService.resolveUnauthorizedPath();

                resolve(false);
            }
        });
    }

    /**
     * Can activate child
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {(Promise<boolean | UrlTree> | boolean)}
     */
    async canActivateChild(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Promise<boolean | UrlTree>
    {
        return this.canActivate(route, state);
    }
}

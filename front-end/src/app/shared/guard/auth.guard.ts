import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild, Router } from '@angular/router';
import { of, Subscription  } from 'rxjs';
import { take, finalize, distinctUntilChanged, tap } from 'rxjs/operators';

import * as _ from 'lodash';

// import { NGXLogger } from 'ngx-logger';
import { fromWorker } from 'observable-webworker';

import { AuthService } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';
import { NavigationService } from '../service/navigation.service';
import { CommonService } from './../service/common.service';

import { CommonHelper } from 'app/utils/common.helper';
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
    //  * @param {NGXLogger} _logger
     * @param {NotificationService} _notify
     * @param {NavigationService} _navService
     * @param {CommonService} _commonService
     */
    constructor(
        private _router: Router,
        private _authService: AuthService,
        // private _logger: NGXLogger,
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
        // this._logger.debug('[is logged in]', this._authService.isAuthenticated());

        CommonHelper.$log('browser refreshed', browserRefresh);

        return new Promise(async (resolve) => 
        {
            try
            {

                // skip guard operation
                if(!_.isEmpty(this._router.getCurrentNavigation().extras.state) && this._router.getCurrentNavigation().extras.state.hasOwnProperty('skipGuard'))
                {
                    resolve(await this.checkAuthProperties(route, state));
                }

                // validate user logged in
                if (this._authService.isAuthenticated())
                {
                    // page not refreshed
                    if (!browserRefresh)
                    {
                        // check for client data
                        const approvedClient = await this._authService.checkClientAccount();
                        // this._logger.debug('[AuthGuard -> client]', approvedClient);
                        
                        // request valid
                        if (approvedClient)
                        {
                            // capture request errors
                            let errors: HttpErrorResponse;

                            // request for auth user
                            this.authSubscription = this._authService
                                .getAuthUser()
                                .pipe(
                                    take(1),
                                    distinctUntilChanged(),
                                    finalize(async () => 
                                    {
                                        // this._logger.debug('[auth guard]', '😀 get auth user done. 🍺');
                                        
                                        // unsubscribe
                                        this.authSubscription.unsubscribe();
        
                                        resolve(await this.checkAuthProperties(route, state, errors));
                                    })
                                )
                                .subscribe(
                                    data =>
                                    {
                                        if (data && data != null)
                                        {
                                            this._authService.authInitialSetup(Object.assign({}, data));
                                        }
                                    },
                                    error =>
                                    {
                                        errors = error;

                                        this._authService.clearAuthUser();

                                        setTimeout(() => this._commonService.onPageViewAnimationChange.next(false), 50);
                                    }
                                );
                        }
                    }
                    else
                    {
                        resolve(await this.checkAuthProperties(route, state));
                    }
                }
                else
                {
                    this._authService.resolvePath();

                    resolve(false);
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

    /**
     * Validations for auth user
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @param {HttpErrorResponse} [responseError=null]
     * @returns {(Promise<boolean> | boolean)}
     */
    checkAuthProperties(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot,
        responseError: HttpErrorResponse = null): Promise<boolean> | boolean
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                // check if response (auth user) has error
                if (responseError && responseError.error)
                {
                    this._notify.displaySnackBar((responseError.error) 
                        ? responseError.error.message 
                        : 'Authentication error'
                    , NotifyType.ERROR);

                    this._authService.clearAuthUser();

                    setTimeout(() => 
                    {    
                        this._authService.resolvePath();
    
                        resolve(this._authService.isAuthenticated());
                    }, 250);
                }
                else
                {
                    // url not found
                    if (!this._navService.checkCurrentRouteExists(state))
                    {
                        this._notify.displaySnackBar('the page you are looking for can not be found', NotifyType.ERROR);
        
                        setTimeout(() => 
                        {
                            this._authService.resolveDefaultPath();
        
                            resolve(false);
                        }, 300);
                    }
    
                    // has no active payment methods
                    else if ((this._authService.isOwnerPath()) && !this._authService.hasActivePaymentMethod()) 
                    {
                        // this._logger.debug('Check if site-manager and resolve payment path');
    
                        // resolve(this._authService.resolvePaymentMethodPath(state));
                    }
                    
                    // others (permission check)
                    else
                    {
                        // check for permission 
                        const belongsTo = !!route && route.data && route.data['belongsTo'] ? route.data['belongsTo'] : null;
                        const permissions = !!route && route.data && route.data['permissions'] ? route.data['permissions'] : [];
                        const hasPerms = await this._authService.hasPermission(permissions, belongsTo);
        
                        if (!hasPerms)
                        {
                            this._notify.displaySnackBar('Unauthorized access', NotifyType.ERROR);
                        }
    
                        // const element = this._document.querySelector('.page-layout');
                        // if (element !== null && hasPerms && (typeof route.data['routeAnimate'] === 'undefined' || route.data['routeAnimate']))
                        // {
                        //     element.classList.add('--hide-content');
                        // }
                        // setTimeout(() => resolve(hasPerms), element !== null && hasPerms ? 500 : 0);

                        /*if (hasPerms && this._authService.isOwner())
                        {
                            const input$ = of('Hello from main thread');

                            fromWorker<any, any>(() => new Worker('app/web-workers/subscriber-branch-access.worker', { type: 'module' }), input$)
                                .subscribe(message => 
                                {
                                    console.log(message);
                                }, error => {
                                    console.error(error);
                                });
                        }*/

                        setTimeout(() => resolve(hasPerms), 250);
                    }
                }
            }
            catch (error)
            {
                throw error;
            }
        });
    }
}

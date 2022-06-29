import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';

import * as _ from 'lodash';

import { NGXLogger } from 'ngx-logger';

import { AuthService } from '../service/auth.service';

import { browserRefresh } from 'app/app.component';
import { UrlHelper } from 'app/utils/url.helper';
import { AppConst } from '../AppConst';

@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate {

    /**
     * Constructor
     *
     * @param {AuthService} _authService
     * @param {NGXLogger} _logger
     */
    constructor(
        private _authService: AuthService,
        private _logger: NGXLogger,
        private _router: Router
    )
    {
        //
    }

    /**
     * Can activate
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Promise<boolean | UrlTree>}
     */
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree>
    {
        this._logger.debug('[route check -> domain]', this._authService._domain);

        // skip guard operation
        if(!_.isEmpty(this._router.getCurrentNavigation().extras.state) && this._router.getCurrentNavigation().extras.state.hasOwnProperty('skipGuard'))
        {
            return true;
        }

        // check for client data
        const checked = !browserRefresh ? await this._authService.checkClientAccount() : true;
        this._logger.debug('[route check -> client]', checked);

        if (checked)
        {
            // when authenticated
            if (this._authService.isAuthenticated())
            {
                if (UrlHelper.removeQueryParameters(state.url) === AppConst.appStart.ENROLLMENT.BASE_URL)
                {
                    this._logger.debug('[enrolment form route]', true);
                    
                    return true;
                } 
                else 
                {
                    this._authService.resolvePath();
                }
            }
            // when not authenticated
            else
            {
                if (this._authService.isAccessiblePath(UrlHelper.removeQueryParameters(state.url)))
                {
                    this._logger.debug('[route accessible path]', true);

                    this._authService.resolveUnauthorizedUrl(state.url);
                }
                else if (!this._authService.isIgnoredPath(state.url) || (this._authService.isIgnoredPath(state.url) && !this._authService.isClientPath() && !this._authService.isOwnerPath()))
                {
                    this._logger.debug('[route resolvePath]', state.url);
                    
                    this._authService.resolvePath();
                }
                else
                {
                    this._logger.debug('[route resolve - ignore path]');
                }
            }
        }

        return true;
    }
}

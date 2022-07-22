import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';

import * as _ from 'lodash';


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
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
        //
    }

    /**
     * Can activate
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Promise<boolean | UrlTree>}
     */
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        console.log('[route check -> domain]', this._authService._domain);

        // skip guard operation
        if (!_.isEmpty(this._router.getCurrentNavigation().extras.state) && this._router.getCurrentNavigation().extras.state.hasOwnProperty('skipGuard')) {
            return true;
        }


        // when not authenticated

        if (this._authService.isAccessiblePath(UrlHelper.removeQueryParameters(state.url))) {
            console.log('[route accessible path]', true);

            this._authService.resolveUnauthorizedUrl(state.url);
        }
        else if (!this._authService.isIgnoredPath(state.url) || (this._authService.isIgnoredPath(state.url))) {
            console.log('[route resolvePath]', state.url);

            this._authService.resolvePath();
        }
        else {
            console.log('[route resolve - ignore path]');
        }

        return true;
    }
}

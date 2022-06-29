import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { AuthService } from '../service/auth.service';


@Injectable({
    providedIn: 'root'
})
export class PublicGuard implements CanActivate {

    /**
     * Constructor
     *
     * @param {Router} _router
     * @param {AuthService} _authService
     * @param {NGXLogger} _logger
     */
    constructor(
        private _router: Router,
        private _authService: AuthService,
    )
    {
        //
    }

    /**
     * Can activate
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<boolean> | Promise<boolean> | boolean}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        return new Promise<boolean>((resolve, reject) =>
        {
            if(this._authService.isClientPath())
            {
                if(!_.isNull(this._authService.getClient()) && this._authService.getClient().isActive())
                {
                    this._authService.resolvePath();
                }
            }
            else
            {
                this._authService.resolvePath();
            }

            setTimeout(() => resolve(true), 0);
        });   
    }

}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RouteResolveGuard implements CanActivate {

    /**
     * Constructor
     *
     * @param {AuthService} _authService
     * @param {NGXLogger} _logger
     * @param {Router} _router
     */
    constructor(
        private _authService: AuthService,
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
     * @returns {Observable<boolean> | Promise<boolean> | boolean}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        return new Promise<boolean>((resolve, reject) =>
        {
            if(this._authService.isClientPath())
            {
                if(!this._authService.isAuthenticated())
                {
                    this._authService.resolveUnauthorizedPath();
                }

                if(this._authService.isAuthenticated() && this._authService.hasActivePaymentMethod())
                {
                    this._authService.resolveDefaultPath();
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

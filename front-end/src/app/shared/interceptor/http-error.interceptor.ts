import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


import { AuthService } from '../service/auth.service';
import { CommonService } from '../service/common.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    /**
     * Constructor
     *
     * @param {AuthService} _authService
     * @param {NGXLogger} _logger
     * @param {CommonService} _commonService
	 * @param {Injector} _injector
     */
    constructor(
        private _authService: AuthService,
        private _commonService: CommonService
    ) 
    { 

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {
        return next
            .handle(request)
            .pipe(
                // retry(1),
                catchError((error: HttpErrorResponse) => 
                {
                    
                    if (error.status === 401) 
                    {
                        this.handle401Error();
                    }

                    return throwError(error);
                })
            );
    }

    private handle401Error(): void
    {
        // this._logger.debug('[401 Unauthorized. 😨]');

        // ui related
        this._commonService.closeAllModels();
        this._commonService.closeMainNavBars();

        // user related
        this._authService.clearAuthUser();
        
        // setTimeout(() => location.reload(), 1500);
        setTimeout(() => this._authService.resolveUnauthorizedPath(), 500);
    }
}

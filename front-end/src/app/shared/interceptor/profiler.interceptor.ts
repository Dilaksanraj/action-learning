import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

// import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ProfilerInterceptor implements HttpInterceptor {

    /**
     * Constructor
     *
	 * @param {NGXLogger} _logger
     */
    constructor(
        // private _logger: NGXLogger
    )
    { 

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const started = Date.now();
        let ok: string;

        return next.handle(request).pipe(
            tap(
                // Succeeds when there is a response; ignore other events
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        ok = 'succeeded';
                    }
                },
                // Operation failed; error is an HttpErrorResponse
                error => (ok = 'failed')
            ),
            // Log when response observable either completes or errors
            finalize(() =>
            {
                if (request.url.indexOf('ping.txt') !== -1) return;
                
                const elapsed = Date.now() - started;
                const msg = `${request.method} "${request.urlWithParams}" ${ok} in ${elapsed} ms.`;
                // this._logger.debug('[request profiler info]', msg);
            })
        );
    }
}

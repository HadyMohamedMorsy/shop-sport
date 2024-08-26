import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { AlertService, GlobalApiResponse } from '@shared';
import { TimeoutError, catchError, filter, tap, throwError } from 'rxjs';

export const HttpResponseInterceptor: HttpInterceptorFn = (request, next) => {
  const injector = inject(Injector);
  const alertService = injector.get(AlertService, null);

  return next(request).pipe(
    filter(
      (event): event is HttpResponse<GlobalApiResponse> =>
        event instanceof HttpResponse
    ),
    // `event is HttpResponse<GlobalApiResponse>` syntax is not a return type, but rather a `type predicate`. the purpose of the `type predicate` is to tell TypeScript that if the predicate function returns true, the type of event inside the `tap` should be narrowed down to HttpResponse<GlobalApiResponse>. This allows you to access properties and methods of HttpResponse<GlobalApiResponse> (like body.status, body.message) without TypeScript raising a type error.
    tap((response) => {
      if (response.body && response.body.status) {
        alertService?.setMessage({
          severity: response.body.status ? 'success' : 'warn',
          detail: response.body.details,
        });
      }
    }),
    // retry({
    //   count: 1,
    //   delay: (_, retryCount) => timer(retryCount * 1000), // 1sec, 2sec, 3sec...etc, error
    //   // we can provide a static value for delay like 1000 (one second),
    //   // but also we can Implement Progressive retry strategies.
    //   // so the interval between calls will be always increasing.
    // }),
    // retry 1 times on failed requests before throwing an error.
    // retry() must comes before the catchError().

    // The error is catched using the catchError operator.
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred 💥💥';

      if (!navigator.onLine) {
        // Handle connection error due to losing internet connection
        errorMessage =
          'No internet connection. Please check your network and try again.';
      } else if (error.error instanceof ErrorEvent) {
        // client side error
        errorMessage = error.error.message;
      } else {
        // server-side error
        switch (error.status) {
          case 422:
            // validation error
            let allErrorMessages = '';
            error.error.errors.forEach((err: HttpErrorResponse) => {
              allErrorMessages += err.message;
            });
            errorMessage = allErrorMessages;
            break;
          case 500:
          case 503:
          case 400:
            // 400 - Bad Request: the server is unable to understand.
            // 500 - Internal Server Error
            // 503 - Service Unavailable
            errorMessage =
              'We have been notified of this mistake and we are looking to fix it.';
            break;
          default:
            // Other server-side errors
            errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
            break;
        }

        if (error instanceof TimeoutError) {
          // Timeout error
          errorMessage = 'Connection timed out.';
        }
      }

      alertService?.setMessage({ severity: 'error', detail: errorMessage });
      return throwError(() => error); // Re-throw the error
    })
  );
};

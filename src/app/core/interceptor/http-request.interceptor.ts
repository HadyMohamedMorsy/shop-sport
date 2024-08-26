import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { finalize } from 'rxjs';

let totalRequests = 0;
let completedRequests = 0;

const excludedEndpoints = ['assets/i18n/', 'auth/login'];

const shouldExcludeRequest = (request: HttpRequest<unknown>) => {
  return excludedEndpoints.some((segment) => request.url.includes(segment));
};

export const HttpRequestInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const startTime = Date.now();

  totalRequests++;

  if (shouldExcludeRequest(request)) {
    return next(request);
  }

  const headers: { [key: string]: string | string[] } = {
    Accept: 'application/json',
  };

  if (!(request.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // If we send FormData, we shouldn't set the Content-Type header, because the browser sets this header to "multipart/form-data". The FormData object does this automatically.

  // Modify all outgoing requests
  request = request.clone({ setHeaders: headers });

  return next(request).pipe(
    finalize(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      completedRequests++;
      console.log(
        `${completedRequests} of ${totalRequests} ${request.url} - (${duration}ms)`
      );
      if (completedRequests === totalRequests) {
        completedRequests = 0;
        totalRequests = 0;
      }
    })
  );
};

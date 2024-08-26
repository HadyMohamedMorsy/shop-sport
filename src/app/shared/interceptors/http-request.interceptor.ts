import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { constants } from '../config';
import { LangService } from '../services';

let totalRequests = 0;
let completedRequests = 0;

export const HttpRequestInterceptor: HttpInterceptorFn = (request, next) => {
  const currentLang = inject(LangService).currentLanguage;

  totalRequests++;
  request = request.clone({
    setHeaders: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      userLanguage: currentLang() || constants.DEFAULT_LANGUAGE,
    },
  });

  return next(request).pipe(
    finalize(() => {
      completedRequests++;
      console.log(`${completedRequests} of ${totalRequests} ${request.url}`);
      if (completedRequests === totalRequests) {
        completedRequests = 0;
        totalRequests = 0;
      };
    }));
};

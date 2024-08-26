import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalApiResponse } from './global';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type RequestHeaders = HttpHeaders | { [header: string]: string | string[] };
type RequestParams =
  | HttpParams
  | {
      [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
    };

@Injectable({ providedIn: 'root' })
export class ApiService {
  #http = inject(HttpClient);
  #apiUrl = environment.API_URL;

  request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: T,
    headers?: RequestHeaders,
    params?: RequestParams
  ) {
    const options = { body, headers, params };

    return this.#http.request<GlobalApiResponse>(
      method,
      `${this.#apiUrl}/${endpoint}`,
      options
    );
  }
}

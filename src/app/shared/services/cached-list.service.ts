import { Injectable, inject } from "@angular/core";
import { Observable, map, shareReplay } from "rxjs";
import { ApiService } from "./api.service";
@Injectable({
  providedIn: 'root'
})
export class CachedListService {
  #api = inject(ApiService);
  #cachedLists$: { [key: string]: Observable<any> } = {}; // #cachedLists$ is introduced as an object that will store the cached observables. The keys of this object will be the endpoints, and the values will be the corresponding observables.

  getListData(endpoint: string, requestType: "GET" | "POST" = "POST", bodyPayload = {}) {
    if (this.#cachedLists$[endpoint]) {
      return this.#cachedLists$[endpoint]; // Return cached data if available
    }

    let request$: Observable<any>;

    if (requestType === "GET") {
      // GET Request
      request$ = this.#api.request("get", endpoint).pipe(
        map(({ data }) => data)
      );
    } else {
      // POST Request
      request$ = this.#api.request("post", endpoint, bodyPayload).pipe(
        map(({ data }) => data)
      );
    }

    this.#cachedLists$[endpoint] = request$.pipe(shareReplay(1));

    return this.#cachedLists$[endpoint];
  }
}
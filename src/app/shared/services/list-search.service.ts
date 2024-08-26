import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter, map } from 'rxjs';
import { ApiService } from './api.service';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root',
})
export class ListSearchService {
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);

  #filtersData = signal<{ [key: string]: any }>({} as { [key: string]: any });
  #getList = computed(() => this.#filtersData());

  setfiltersData(config: { [key: string]: any }) {
    this.#filtersData.set({
      columns: [
        {title: config.name, name: 'id', searchable: true, orderable: true },
        {title: config.name, name: config.name, searchable: true,orderable: true},
      ],
      order: [{ column: 0, dir: config.direction || 'asc' }],
      start: config.start || 0,
      length: config.length || 10,
      search: { value: config.query, regex: true },
      type: 'selections',
    });

    return this;
  }

  sendRequest(endPoint: string) {
    return this.#api.request('post', endPoint, this.#getList()).pipe(
      filter(() => Object.keys(this.#getList()).length > 0),
      debounceTime(1000),
      map((response) => {
        return response.data.data;
      }),
      takeUntilDestroyed(this.#destroyRef)
    );
  }
}

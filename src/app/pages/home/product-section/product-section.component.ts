import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { ProductCardComponent } from '../../../shared/components';
import { ApiService, FiltersData } from '../../../shared/services';
import { productBodyPayload } from './body-request';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [
    DataViewModule,
    SkeletonModule,
    ProductCardComponent,
    TranslateModule,
  ],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSectionComponent {
  id = input<number>(0);
  #api = inject(ApiService);

  isLoading = signal(true);
  records = signal<any[]>([]);
  totalRecords = signal<number>(0);
  recordsFiltered = signal<number>(0);
  rows = signal<number>(3);
  filtersData = signal<FiltersData>({} as FiltersData);

  effect = effect(
    () => {
      if (this.id()) {
        this.loadProducts({} as LazyLoadEvent);
      }
    },
    { allowSignalWrites: true }
  );

  loadRecords$ = toObservable(this.filtersData).pipe(
    filter(() => Object.keys(this.filtersData()).length > 0),
    tap(() => this.isLoading.set(true)),
    switchMap((filters) => {
      const urlEndPoint = this.id()
        ? `category/${this.id()}/show`
        : 'product/index';
      return this.#api.request('post', urlEndPoint, filters).pipe(
        map(({ data }) => data),
        tap((data) => {
          this.records.set(data.data);
          this.totalRecords.set(data.recordsTotal);
          this.recordsFiltered.set(data.recordsFiltered);
          this.isLoading.set(false);
        }),
        catchError(() => {
          return of({});
        })
      );
    })
  );

  loadProducts(event: LazyLoadEvent) {
    this.isLoading.set(true);
    this.filtersData.update((oldFilters) => {
      return {
        ...oldFilters,
        length: event.rows || 10,
        start: event.first || 0,
        search: { value: null, regex: false },
        columns: productBodyPayload.columns,
        order: [{ column: 0, dir: 'asc' }],
        type: 'selections',
      };
    });
  }

  products = toSignal<any[], any[]>(this.loadRecords$, { initialValue: [] });
}

import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';
import { filter, map } from 'rxjs';
import { CachedListService, ListSearchService } from '../../services';
import { categoriseBodyPayload } from '../nav-large-screen/body-request';
import { Product } from '../product-card/product-card.component';
import { ProductDetailsComponent } from '../product-card/product-details/product-details.component';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    PanelModule,
    NgClass,
    RouterLink,
    TranslateModule,
    FormsModule,
    AutoCompleteModule,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  #router = inject(Router);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #cachedList = inject(CachedListService);
  #listSearch = inject(ListSearchService);
  #dialogService = inject(DialogService);
  #translate = inject(TranslateService);
  ref: DynamicDialogRef | undefined;

  categories$ = this.#cachedList
    .getListData('category/index', 'POST', categoriseBodyPayload)
    .pipe(map(({ data }) => data));

  categories = toSignal<any[], any[]>(this.categories$, { initialValue: [] });

  sidebarVisible = model<boolean>(false);

  ngOnInit() {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => this.sidebarVisible.set(false));
  }

  selectLink!: { slug: string; title: string };
  menuList = signal<{ slug: string; title: string }[]>([]);

  globalSearch({ query }: any) {
    if (query) {
      const request = this.#listSearch
        .setfiltersData({ name: 'name', query })
        .sendRequest('product/index');

      request.subscribe((response) => {
        this.menuList.set(response);
      });
    }
  }

  showDialog(product: Product) {
    this.ref = this.#dialogService.open(ProductDetailsComponent, {
      header: this.#translate.instant(_('View Product')),
      width: '65vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: product,
    });
  }

  editImageUrl(image: string) {
    let convertImage = image.split('/');

    let fullImage =
      convertImage[convertImage.length - 2] +
      '/' +
      convertImage[convertImage.length - 1];
    return `https://digitalatum.com/projects/productions/ShopShimmer/src/backend/storage/app/public/media/products/${fullImage}`;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { StyleClassModule } from 'primeng/styleclass';
import {
  BreakpointService,
  LangService,
  ListSearchService,
} from '../../services';
import { CartService } from '../../services/cart.service';
import { CartItemsListComponent } from '../cart-items-list/cart-items-list.component';
import { Product } from '../product-card/product-card.component';
import { ProductDetailsComponent } from '../product-card/product-details/product-details.component';
import { ProductItemListComponent } from '../product-item-list/product-item-list.component';

@Component({
  selector: 'app-header-top',
  standalone: true,
  imports: [
    RouterLink,
    AutoCompleteModule,
    ProductItemListComponent,
    ButtonModule,
    DynamicDialogModule,
    TranslateModule,
    CartItemsListComponent,
    StyleClassModule,
    FormsModule,
    BadgeModule,
    RouterLinkActive,
  ],
  templateUrl: './header-top.component.html',
  styleUrl: './header-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderTopComponent {
  #cartService = inject(CartService);
  #breakpoint = inject(BreakpointService);
  currentLang = inject(LangService).currentLanguage;
  #listSearch = inject(ListSearchService);
  #dialogService = inject(DialogService);
  #translate = inject(TranslateService);
  ref: DynamicDialogRef | undefined;

  count = this.#cartService.countProducts;

  isSmScreen = this.#breakpoint.isSmScreen;
  isMdScreen = this.#breakpoint.isMdScreen;
  isLgScreen = this.#breakpoint.isLgScreen;
  isXlScreen = this.#breakpoint.isXlScreen;

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

  editImageUrl(image: string) {
    let convertImage = image.split('/');

    let fullImage =
      convertImage[convertImage.length - 2] +
      '/' +
      convertImage[convertImage.length - 1];
    return `https://digitalatum.com/projects/productions/ShopShimmer/src/backend/storage/app/public/media/products/${fullImage}`;
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
}

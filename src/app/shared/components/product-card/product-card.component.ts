import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CartService } from '../../services/cart.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export interface Product {
  id: number;
  price: number;
  price_change: number;
  name: string;
  image_full_url: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ButtonModule, DynamicDialogModule, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  #dialogService = inject(DialogService);
  #cartService = inject(CartService);
  #translate = inject(TranslateService)

  visible: boolean = false;
  ref: DynamicDialogRef | undefined;

  product = input<Product>({} as Product);

  showDialog() {
    this.ref = this.#dialogService.open(ProductDetailsComponent, {
      header: this.#translate.instant(_('View Product')),
      width: '65vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: this.product()
    });
  }

  editImageUrl(image: string) {
    let convertImage = image.split('/');

    let fullImage =
      convertImage[convertImage.length - 2] + '/' +
      convertImage[convertImage.length - 1];
    return `https://digitalatum.com/projects/productions/ShopShimmer/src/backend/storage/app/public/media/products/${fullImage}`;
  }

  addCart(product: Product) {
    this.#cartService.addToCart(product);
  }
}

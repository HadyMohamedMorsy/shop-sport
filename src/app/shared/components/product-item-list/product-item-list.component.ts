import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CartItem, CartService } from '../../services/cart.service';
import { ProductQtyComponent } from '../product-qty/product-qty.component';

@Component({
  selector: 'app-product-item-list',
  standalone: true,
  imports: [ProductQtyComponent, TranslateModule, TooltipModule, ButtonModule],
  templateUrl: './product-item-list.component.html',
  styleUrl: './product-item-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemListComponent {
  #cartService = inject(CartService);

  productItem = input<CartItem>({} as CartItem);

  deleteItem() {
    this.#cartService.deleteCartItem(this.productItem().product.id);
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

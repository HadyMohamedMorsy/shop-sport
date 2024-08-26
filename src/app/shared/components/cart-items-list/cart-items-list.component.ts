import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../services/cart.service';
import { ProductItemListComponent } from '../product-item-list/product-item-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-items-list',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    ButtonModule,
    ProductItemListComponent,
    NgClass,
  ],
  templateUrl: './cart-items-list.component.html',
  styleUrl: './cart-items-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemsListComponent {
  #cartService = inject(CartService);

  cartItemCount = this.#cartService.countProducts;
  cartItems = this.#cartService.cartItems;
  total = this.#cartService.getCartTotalPrice;
}

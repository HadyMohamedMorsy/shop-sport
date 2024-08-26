import { Injectable, computed, inject, signal } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../components';
import { AlertService } from './alert.service';
import { StorageService } from './storage.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  #storage = inject(StorageService);
  #alert = inject(AlertService);
  #translate = inject(TranslateService);

  #CARTITEMS_KEY = 'cart-items';

  cartItems = signal<CartItem[]>(
    this.#storage.getLocalData(this.#CARTITEMS_KEY, true) || []
  );

  getCartTotalPrice = computed<number>(() => {
    const total = this.cartItems().reduce(
      (total: number, item: CartItem) =>
        total + this.getCartItemTotalPrice(item),
      0
    );
    return total;
  });

  countProducts = computed(() => this.cartItems().length);

  addToCart(product: Product) {
    const productEx = this.cartItems().find(
      (item) => item.product.id === product.id
    );
    if (productEx) {
      productEx.quantity = productEx.quantity + 1;
      productEx.product.price_change =
        +productEx.product.price * productEx.quantity;

      this.cartItems.update((items) =>
        items.map((item) =>
          item.product.id === productEx.product.id
            ? { ...item, ...productEx }
            : item
        )
      );
      this.#alert.setMessage({
        severity: 'success',
        detail: this.#translate.instant(
          _('This Product was Added quantit it will be increased')
        ),
      });
    } else {
      this.#alert.setMessage({
        severity: 'success',
        detail: this.#translate.instant(
          _('This Product is Added on Your Cart Items')
        ),
      });
      this.cartItems.set([...this.cartItems(), { product, quantity: 1 }]);
    }
    this.#storage.storeLocalData(this.#CARTITEMS_KEY, this.cartItems());
  }

  deleteCartItem(productId: number) {
    this.cartItems.update((items) =>
      items.filter((i) => i.product.id !== productId)
    );
    this.#alert.setMessage({
      severity: 'success',
      detail: this.#translate.instant(_('This Product is deleted Successfuly')),
    });

    this.#storage.storeLocalData(this.#CARTITEMS_KEY, this.cartItems());
  }

  updateCartQuantity(product: Product, quantity: number) {
    const productEx = this.cartItems().find(
      (item) => item.product.id === product.id
    );
    if (productEx) {
      productEx.quantity = quantity;
      productEx.product.price_change =
        +productEx.product.price * productEx.quantity;

      this.cartItems.update((items) =>
        items.map((item) =>
          item.product.id === productEx.product.id
            ? { ...item, ...productEx }
            : item
        )
      );
      this.#alert.setMessage({
        severity: 'success',
        detail: this.#translate.instant(_('This Product its quantity changed')),
      });

      this.#storage.storeLocalData(this.#CARTITEMS_KEY, this.cartItems());
    }
  }

  getCartItemTotalPrice(item: CartItem): number {
    return +item.product.price_change || 0 * item.quantity;
  }

  clearCart() {
    this.cartItems.set([]);
    this.#storage.removeLocalData(this.#CARTITEMS_KEY);
  }
}

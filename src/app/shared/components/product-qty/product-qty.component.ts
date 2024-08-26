import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../services/cart.service';
import { Product } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-qty',
  standalone: true,
  imports: [InputNumberModule, FormsModule],
  templateUrl: './product-qty.component.html',
  styleUrl: './product-qty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQtyComponent {
  #cartService = inject(CartService);
  #cd = inject(ChangeDetectorRef)

  product = input<Product>({} as Product);
  quantity = 1;

  effect = effect(() => {
    if (this.#cartService.cartItems()) {
      const productEx = this.#cartService
        .cartItems()
        .find((item) => item.product.id === this.product().id);
      this.quantity = productEx?.quantity ?? 1;
      this.#cd.markForCheck();
    }
  });

  updateCart(quantity: number) {
    this.#cartService.updateCartQuantity(this.product(), quantity);
  }
}

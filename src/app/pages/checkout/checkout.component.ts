import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { ProductItemListComponent } from '../../shared/components/product-item-list/product-item-list.component';
import { AlertService, ApiService } from '../../shared/services';
import { CartService } from '../../shared/services/cart.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

interface Payment {
  shipping_address: string;
  first_name: string;
  last_name: string;
  phone: string;
  phone_2: string;
  client_comment: string;
}

export type ContactModel = {
  [field in keyof Payment]: FormControl<Payment[field] | null>;
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    TranslateModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    NgStyle,
    ButtonModule,
    ProductItemListComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckoutComponent {
  #cartService = inject(CartService);
  #alert = inject(AlertService);
  #translate = inject(TranslateService);

  count = this.#cartService.countProducts;

  #fb = inject(FormBuilder);
  #api = inject(ApiService);

  loading = signal(false);

  cartItemCount = this.#cartService.countProducts;
  cartItems = this.#cartService.cartItems;
  total = this.#cartService.getCartTotalPrice;

  formData!: FormGroup;

  ngOnInit() {
    this.formData = this.#fb.group<ContactModel>({
      shipping_address: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      phone_2: new FormControl('', [Validators.required]),
      client_comment: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(formData: ContactModel) {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const model = {
      products: this.#cartService.cartItems().map((product) => {
        return {
          product_id: product.product.id,
          qty: product.quantity,
          price_change: product.product.price_change,
        };
      }),
      ...formData,
    };
    this.#api
      .request('post', 'order/store', model)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.#alert.setMessage({
            severity: 'success',
            detail: this.#translate.instant(
              _('order successed please waitings us for your order')
            ),
          });
          this.formData.reset();
          this.#cartService.clearCart()
        },
        error: () => {
          this.#alert.setMessage({
            severity: 'danger',
            detail: this.#translate.instant(
              _('there Somthing wrong with your Orders Please Contact With Us')
            ),
          });
        },
      });
  }
}

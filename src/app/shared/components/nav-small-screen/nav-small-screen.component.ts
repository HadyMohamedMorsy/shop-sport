import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { CartService } from '../../services/cart.service';
import { CartItemsListComponent } from '../cart-items-list/cart-items-list.component';

@Component({
  selector: 'app-nav-small-screen',
  standalone: true,
  imports: [
    ButtonModule,
    CartItemsListComponent,
    StyleClassModule,
    TranslateModule,
    BadgeModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './nav-small-screen.component.html',
  styleUrl: './nav-small-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavSmallScreenComponent {
  #cartService = inject(CartService);
  count = this.#cartService.countProducts;

  navStyleClass = input<string>('');
  customStyleButton = input(true);

  sidebarVisible = output<boolean>();
}

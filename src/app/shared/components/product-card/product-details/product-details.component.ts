import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartService } from '../../../services/cart.service';
import { ProductQtyComponent } from '../../product-qty/product-qty.component';
import { Product } from '../product-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ButtonModule, ProductQtyComponent, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  #cartService = inject(CartService);
  public dialogRef = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public editData = this.dialogConfig.data;

  addCart(product: Product) {
    this.#cartService.addToCart(product);
    this.closeDialog();
  }

  editImageUrl(image: string) {
    let convertImage = image.split('/');

    let fullImage =
      convertImage[convertImage.length - 2] +
      '/' +
      convertImage[convertImage.length - 1];
    return `https://digitalatum.com/projects/productions/ShopShimmer/src/backend/storage/app/public/media/products/${fullImage}`;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

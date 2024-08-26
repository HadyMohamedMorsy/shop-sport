import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-delete-btn',
  standalone: true,
  imports: [],
  templateUrl: './product-delete-btn.component.html',
  styleUrl: './product-delete-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDeleteBtnComponent {

}

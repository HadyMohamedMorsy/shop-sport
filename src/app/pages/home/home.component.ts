import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SectionTitleComponent } from '@shared';
import { ProductSectionComponent } from './product-section/product-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgStyle,
    ProductSectionComponent,
    TranslateModule,
    SectionTitleComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  @Input() id!: number;
}

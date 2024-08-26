import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundComponent {
  #document = inject(DOCUMENT);
  #renderer = inject(Renderer2);

  ngOnInit() {
    this.#renderer.addClass(this.#document.body, 'remove-banner');
  }

  ngOnDestroy() {
    this.#renderer.removeClass(this.#document.body, 'remove-banner');
  }
}

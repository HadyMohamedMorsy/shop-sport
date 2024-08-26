import { AsyncPipe, DOCUMENT, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [AsyncPipe, ButtonModule],
  template: `
    @if(showScroll()){
    <button
      pButton
      class="bg-secondary-gradient text-800 w-3rem h-3rem border-none border-noround bg-[#ff4d1c]"
      icon="pi pi-chevron-up"
      (click)="onScrollToTop()"
    ></button>
    }
  `,
  styles: `
    button {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      z-index: 5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollTopComponent {
  readonly #document = inject(DOCUMENT); // DOCUMENT is a DI Token representing the main rendering context. In a browser and SSR this is the DOM Document. When using SSR, that document is created by [Domino](https://github.com/angular/domino).
  readonly #viewport = inject(ViewportScroller);

  // fromEvent creates an Observable from DOM events. It takes two arguments: the target object where the event listener is attached, the name of the event to listen for.
  readonly showScroll$ = fromEvent(this.#document, 'scroll').pipe(
    map(() => this.#viewport.getScrollPosition()[1] > 200)
  );

  showScroll = toSignal(this.showScroll$, { initialValue: false });

  onScrollToTop(): void {
    this.#viewport.scrollToPosition([0, 0]);
  }
}
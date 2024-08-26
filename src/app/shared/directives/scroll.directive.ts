import { Directive, ElementRef, HostListener, Renderer2, inject, input } from '@angular/core';

@Directive({
  selector: '[appScroll]',
  standalone: true
})
export class ScrollDirective {
  #el = inject(ElementRef);
  #renderer = inject(Renderer2);

  scrollClass = input('');
  threshold = input(-250);

  @HostListener("window:scroll", [])
  onScroll() {
    const elementPosition = this.#el.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const isFullyVisible = (
      elementPosition.top >= this.threshold() &&
      elementPosition.bottom <= viewportHeight - this.threshold()
    );

    if (isFullyVisible) {
      this.#renderer.addClass(this.#el.nativeElement, this.scrollClass());
    };
  };
}

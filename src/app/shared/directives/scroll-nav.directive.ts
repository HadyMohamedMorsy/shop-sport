import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appScrollNav]',
  standalone: true
})
export class ScrollNavDirective {
  #el = inject(ElementRef);
  #renderer = inject(Renderer2);

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const navbar = this.#el.nativeElement;

    if (scrollPosition > 250) {
      this.#renderer.addClass(navbar, 'fixed-navbar');
    } else {
      this.#renderer.removeClass(navbar, 'fixed-navbar');
    }
  }
}

import { Directive, ElementRef, Renderer2, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { animationFrameScheduler, distinctUntilChanged, endWith, interval, map, switchMap, takeWhile, tap } from 'rxjs';

const easeOutQuad = (x: number): number => x * (2 - x);

@Directive({
  selector: '[countUp]',
  standalone: true
})
export class CountUpDirective {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  readonly count = input(0);
  readonly duration = input(2000);

  readonly #currentCount$ = toObservable(this.count).pipe(
    switchMap(count => {
      // get the time when animation is triggered
      const startTime = animationFrameScheduler.now();

      return interval(0, animationFrameScheduler).pipe(
        // calculate elapsed time
        map(() => animationFrameScheduler.now() - startTime),
        // calculate progress
        map(elapsedTime => elapsedTime / this.duration()),
        // complete when progress is greater than 1
        takeWhile(progress => progress <= 1),
        // apply quadratic ease-out
        // for faster start and slower end of counting
        map(easeOutQuad),
        // calculate current count
        map(progress => Math.round(progress * count)),
        // make sure that last emitted value is count
        endWith(count),
        distinctUntilChanged()
      );
    }),
    tap(currentCount => {
      this.#renderer.setProperty(
        this.#elementRef.nativeElement,
        'innerHTML',
        currentCount
      );
    })
  );

  readonlyCount = toSignal(this.#currentCount$, { initialValue: 0 });
}

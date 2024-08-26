import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [],
  template: `
    @if(showSubTitle()){
      <h6 class="subtitle">
        <img src="assets/media/bage_head.svg"
        alt="">
        <ng-content select="[subtitle]"></ng-content>
      </h6>
    }
    <h2 class="xl:text-4xl lg:text-2xl text-2xl text-primary-color leading-relaxed my-4 text-center">
      <ng-content select="[title]"></ng-content>
    </h2>
  `,
  styles: `
      ::ng-deep .subtitle {
        position: relative;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 100%;
        text-transform: uppercase;
        color: var(--secoundary-color);
        padding-bottom: 10px;
        display: inline-flex;
        align-items: center;
        gap: 10px;

        &::after {
          content: "";
          bottom: 0%;
          position: absolute;
          inset-inline-start: 0;
          z-index: 1;
          width: 100%;
          height: 2px;
          background-color: var(--secoundary-color);
        }

        &:empty {
          display: none;
        }
      }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionTitleComponent {
  showSubTitle = input<boolean>(true);
}
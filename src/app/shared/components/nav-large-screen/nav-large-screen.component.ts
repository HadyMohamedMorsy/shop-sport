import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { map } from 'rxjs';
import { CachedListService } from '../../services';
import { categoriseBodyPayload } from './body-request';

@Component({
  selector: 'app-nav-large-screen',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    SkeletonModule,
    ButtonModule,
    RouterLinkActive,
  ],
  templateUrl: './nav-large-screen.component.html',
  styleUrl: './nav-large-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLargeScreenComponent {
  #cachedList = inject(CachedListService);

  categories$ = this.#cachedList
    .getListData('category/index', 'POST', categoriseBodyPayload)
    .pipe(map(({ data }) => data));

  categories = toSignal<any[], any[]>(this.categories$, { initialValue: [] });
}

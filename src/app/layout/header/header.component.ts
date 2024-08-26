import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BreakpointService,
  HeaderTopComponent,
  LangSwitcherComponent,
  NavLargeScreenComponent,
  NavSmallScreenComponent,
  ReplaceHyphensPipe,
  ScrollNavDirective,
  SidebarComponent,
} from '@shared';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HeaderTopComponent,
    ScrollNavDirective,
    ReplaceHyphensPipe,
    NavSmallScreenComponent,
    NavLargeScreenComponent,
    TranslateModule,
    LangSwitcherComponent,
    SidebarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  #breakpoint = inject(BreakpointService);
  #activeRoute = inject(ActivatedRoute);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  title = signal('');
  signalTitlePost = input<string>('');

  ngOnInit() {
    const childRoute = this.#childRoute(this.#activeRoute);
    this.title.set(childRoute.snapshot.data['title']);
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.#activeRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ title }) => {
        this.title.set(title);
      });
  }

  #childRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    while (activatedRoute.firstChild) {
      activatedRoute = activatedRoute.firstChild;
    }
    return activatedRoute;
  }

  sidebarVisible = signal(false);

  isSmScreen = this.#breakpoint.isSmScreen;
  isMdScreen = this.#breakpoint.isMdScreen;
  isLgScreen = this.#breakpoint.isLgScreen;
  isXlScreen = this.#breakpoint.isXlScreen;
}

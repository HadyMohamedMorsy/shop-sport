import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { routes } from './app.routes';
import { constants } from './shared/config';
import {
  HttpRequestInterceptor,
  HttpResponseInterceptor,
} from './shared/interceptors';
import { CustomPageTitleProvider, LangService } from './shared/services';
import { provideLottieOptions } from 'ngx-lottie';

export function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function initializeLangFactory(langService: LangService) {
  const lang = langService.currentLanguage() || constants.DEFAULT_LANGUAGE;
  return () => langService.initApp(lang);
}

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    CustomPageTitleProvider,
    DynamicDialogConfig,
    DynamicDialogRef,
    DialogService,
    provideAnimationsAsync(),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'ignore', // "ignore" (The default), "reload"
        paramsInheritanceStrategy: 'always', // 'always' (The default), 'emptyOnly'
      }),
      withInMemoryScrolling({
        // Enable scrolling to anchors
        anchorScrolling: 'enabled',
        // Configures if the scroll position needs to be restored when navigating back.
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideHttpClient(
      withInterceptors([HttpResponseInterceptor, HttpRequestInterceptor])
    ),
    importProvidersFrom(
      LoadingBarHttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLangFactory,
      deps: [LangService],
      multi: true,
    },
  ],
};

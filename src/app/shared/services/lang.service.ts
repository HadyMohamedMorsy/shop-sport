import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LangService {
  #translate = inject(TranslateService);
  #storage = inject(StorageService);
  #primengConfig = inject(PrimeNGConfig);
  #document = inject(DOCUMENT);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  currentLanguage = signal<string>(this.#storage.getLangApp() as string);

  switchLanguage(lang: string) {
    // this.#translate.setDefaultLang(lang);
  }

  initApp(lang: string) {
    this.#translate.setDefaultLang(lang);
    this.#storage.setLangApp(lang);
    this.currentLanguage.set(lang);
    this.#changeHtmlAttributes(lang);
    this.#translatePrimeNg();
  }

  #changeHtmlAttributes(lang: string) {
    const htmlTag = this.#document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
    htmlTag.lang = lang;
    htmlTag.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  #translatePrimeNg() {
    this.#translate
      .get('primeng')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => this.#primengConfig.setTranslation(res));
  }
}

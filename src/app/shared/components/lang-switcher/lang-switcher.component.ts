import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { LangService, StaticDataService } from '../../services';

@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
  standalone: true,
  imports: [NgClass, TranslateModule, DropdownModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  #langService = inject(LangService);
  #static = inject(StaticDataService);
  styleColorlabel = input('text-white');

  countries = signal(this.#static.languages);
  selectedCountry = this.#langService.currentLanguage;

  switchLang(lang: string) {
    this.#langService.switchLanguage(lang);
    this.#langService.initApp(lang);
  }
}

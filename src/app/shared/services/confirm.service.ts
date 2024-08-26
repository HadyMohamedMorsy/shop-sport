import { Injectable, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

interface ConfirmConfig {
  target?: any;
  key?: string;
  header?: string;
  message?: string;
  acceptCallback: Function;
  rejectCallback?: Function;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  #confirm = inject(ConfirmationService);
  #translate = inject(TranslateService);

  header = this.#translate.instant(_('are_you_sure'));
  message = this.#translate.instant(_('You_will_not_be_able_to_revert'));

  confirmDelete(config: ConfirmConfig): void {
    this.#confirm.confirm({
      target: config?.target || undefined,
      key: config?.key || config.target ? undefined : "globalConfirmDialog",
      header: config?.header || this.header,
      message: config?.message || config.target ? this.header : this.message,
      icon: "pi pi-exclamation-triangle text-yellow-500",
      acceptButtonStyleClass: "px-3 py-2 text-sm p-button-danger",
      rejectButtonStyleClass: "px-3 py-2 text-sm text-800 bg-gray-100 hover:bg-gray-200 border-none",
      accept: config.acceptCallback,
      reject: config?.rejectCallback
    });
  };
}

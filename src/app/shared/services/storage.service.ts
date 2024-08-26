import { Injectable } from '@angular/core';
import { constants } from '../config';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #secretKey =
    '79b80065a479e05115762cc56b48a42f7f1092a316499fc2b46a78ffd55f69d6';

  APP_LANGUAGE_KEY = 'LOCALIZE_DEFAULT_LANGUAGE';

  setLangApp(lang: string): void {
    localStorage.removeItem(this.APP_LANGUAGE_KEY);
    localStorage.setItem(this.APP_LANGUAGE_KEY, lang);
  }

  getLangApp() {
    return (
      localStorage.getItem(this.APP_LANGUAGE_KEY) || constants.DEFAULT_LANGUAGE
    );
  }

  #encryptData(txt: string) {
    return CryptoJS.AES.encrypt(txt, this.#secretKey).toString();
  }

  #decryptData(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.#secretKey).toString(
      CryptoJS.enc.Utf8
    );
  }

  storeLocalData<T>(key: string, data: T): void {
    const encryptedData = this.#encryptData(JSON.stringify(data)).toString();
    localStorage.setItem(key, encryptedData);
  }

  getLocalData(key: string, parseIt = false) {
    const decryptedData = localStorage.getItem(key) as string;
    if (!decryptedData) return;
    if (parseIt) {
      return JSON.parse(this.#decryptData(decryptedData));
    } else {
      return this.#decryptData(decryptedData);
    }
  }

  removeLocalData(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocalData(): void {
    localStorage.clear();
  }
}

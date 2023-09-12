import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Default language
    this.translate.use('en'); // Initial language
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }
}

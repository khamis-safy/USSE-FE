import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
 currLang: string;

constructor(private translate: TranslateService) {
  this.translate.setDefaultLang('en'); // Default language
  this.setCurrentLanguage(); // Initialize current language
  this.setDirectionForLanguage(); // Set direction based on current language
}

setCurrentLanguage() {
  this.currLang = localStorage.getItem("currentLang") || 'en';
  this.translate.use(this.currLang); // Set the current language
}

setLanguage(lang: string) {
  this.currLang = lang;
  this.translate.use(lang);
  localStorage.setItem("currentLang", lang); // Save the current language preference
  this.setDirectionForLanguage(); // Update the direction when the language changes
}

getDirectionForLanguage(languageCode: string): string {
  // Add more language codes as needed
  return languageCode === 'ar' ? 'rtl' : 'ltr';
}

setDirectionForLanguage() {
  let languageDirection = this.getDirectionForLanguage(this.currLang);
  document.documentElement.dir = languageDirection;
}


}

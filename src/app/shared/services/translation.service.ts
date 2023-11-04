import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
 currLang: string;
 currentLang:string;
  body: any;

constructor(private translate: TranslateService) {
  ; // Default language
  this.setCurrentLanguage(); // Initialize current language
  this.setDirectionForLanguage(); // Set direction based on current language
}

setCurrentLanguage() {
  this.currLang = localStorage.getItem("currentLang") || 'en';
  this.translate.setDefaultLang(this.currLang)
  this.translate.use(this.currLang); // Set the current language
}
getCurrentLanguage(){
  return  this.currLang 
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
translateMessage(message:string):string{
  return this.translate.instant(message)
}
getLanguageDirection(): 'rtl' | 'ltr' {
  const storedLanguage = localStorage.getItem("currentLang");
  return storedLanguage === 'ar' ? 'rtl' : 'ltr'; // Assuming 'ar' represents Arabic language
}
setAppDirection(){
  this.currentLang = localStorage.getItem('currentLang') || 'en';
  this.translate.use(this.currentLang);
  document.documentElement.dir=  this.currentLang === 'ar' ? 'rtl' : 'ltr'
  this.body = document.querySelector('body');
  this.body.classList.remove('rtl','ltr')
  this.body.classList.add(this.currentLang === 'ar' ? 'rtl' : 'ltr');
}

}

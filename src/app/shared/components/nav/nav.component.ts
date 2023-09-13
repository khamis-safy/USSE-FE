import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
language:string=localStorage.getItem("currentLang")=="ar"?"العربية":"English";
currentLang:string;
constructor(private translationService: TranslationService) {
  this.currentLang=localStorage.getItem("currentLang") || "en";
  translationService.setLanguage(this.currentLang)
}
switchLanguage(lang: string) {
  this.translationService.setLanguage(lang);
  localStorage.setItem("currentLang",lang)
}
}

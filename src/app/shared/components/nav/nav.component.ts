import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
language:string="English";
constructor(private translationService: TranslationService) {}
switchLanguage(lang: string) {
  this.translationService.setLanguage(lang);
}
}

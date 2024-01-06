import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SidenavComponent } from 'src/app/pages/sidenav/sidenav.component';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
language:string=localStorage.getItem("currentLang")=="ar"?"العربية":"English";
currentLang:string;
constructor(private translationService: TranslationService,
  private drawerService: NzDrawerService
  ) {
  
}
switchLanguage(lang: string) {
  localStorage.setItem("currentLang",lang);
  location.reload()

}
openSideNav() {
  const currentLang = localStorage.getItem("currentLang");
  const isRtl = currentLang === "ar";
  const placement = isRtl ? 'right' : 'left';

  const drawerRef = this.drawerService.create({
    nzWidth: '50vw',
    nzClosable: true,
    nzContent: SidenavComponent,
    nzDirection: isRtl ? 'rtl' : 'ltr',
    nzPlacement: placement
  });
}
}

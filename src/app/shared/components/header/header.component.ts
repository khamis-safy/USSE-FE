import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PluginsService } from 'src/app/services/plugins.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  profileImage:any=null;
  searchValue_:any;
  ResourcesData:any;
  constructor(private rend:Renderer2, public plugin:PluginsService,public translate:TranslateService) {

  }
  changeCurrentLang(lang:string){
    this.translate.use(lang);
    localStorage.setItem('currentLang',lang);
  }
  ngAfterViewInit(): void {
    this.plugin.initToolTip();
  }
  toggleSearchbar(searchbar:any,searchInput:any){
    if(!searchbar.classList.contains("d-none")){
      searchInput.focus();
    }

  }
  toggleSearchRes(res:any){
    res.classList.toggle("d-none")
  }
}

import { Component, HostBinding, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PluginsService } from './services/plugins.service';
import { AuthService } from './shared/services/auth.service';
import { UsersService } from './pages/users/users.service';
import { TranslationService } from './shared/services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pro2023';
  darkActive:boolean = false;
  currentLang:string;
  languageDirection: string;

  constructor(private plugin:PluginsService,public translate:TranslateService,private languageService:TranslationService,private authService:AuthService, private userServiece:UsersService){
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.dir=  this.currentLang === 'ar' ? 'rtl' : 'ltr'
    let body:any = document.querySelector('body');

    body.classList.add(this.currentLang === 'ar' ? 'rtl' : 'ltr');
  }

  ngOnInit(): void {
    if(this.authService.userInfo.customerId!=""){
      let email=this.authService.userInfo.email;
      this.getUserPermisisons(email);
    }
    this.initMode();

  }
  getUserPermisisons(email){
    this.userServiece.getUserByEmail(email).subscribe(
      (res)=>{
        let userPermissions=this.userServiece.executePermissions(res.permissions);
        this.authService.updateUserPermisisons(res.permissions);
        this.authService.updatePermissions(userPermissions)
console.log("from app",this.authService.userPermissions)

      },
      (err)=>{}
    )

}
  initMode(){
    if (this.plugin.getData("dark") == true){
      this.darkActive=true;
      const body:any = document.querySelector("body");
      body.classList.toggle("dark");
    }
    if(this.plugin.getData("color-2") !=null){
      this.plugin.SetCssVar("--color-2",this.plugin.getData("color-2"))
      this.plugin.SetCssVar("--color-3",this.plugin.getData("color-3"))
    }
  }
  darkModeToggle(){
      const body:any = document.querySelector("body");
      if(body.classList.contains("dark")){
        this.darkActive = false;
        this.plugin.setData(this.darkActive,"dark")
        body.classList.toggle("dark");
      }else{
        this.darkActive = true;
        this.plugin.setData(this.darkActive,"dark")
        body.classList.toggle("dark");
      }
    }
    changeColor(primColor:string,subColor:string){
      this.plugin.setData(primColor,"color-2");
      this.plugin.setData(subColor,"color-3");
      this.plugin.SetCssVar("--color-2",primColor)
      this.plugin.SetCssVar("--color-3",subColor)
    }
}

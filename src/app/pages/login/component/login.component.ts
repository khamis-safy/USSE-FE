import { Component, OnInit} from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PluginsService } from 'src/app/services/plugins.service';
import { UserData } from '../../users/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit{
email:any ;
password:any;
form: FormGroup;
loading;
invalid:boolean=false;
userInfo:any;
  constructor(private plugin:PluginsService,private authService:AuthService,private loginService:LoginService,private router:Router) {

  }
  ngOnInit() {
    this.email=new FormControl('',[Validators.required,Validators.pattern(this.plugin.emailReg)]);
    this.password =new FormControl('',[Validators.required,Validators.pattern(this.plugin.passReg)])
    this.form=new FormGroup(
      {
        email:this.email,
        password:this.password
      }
    )
  }
  login(){
    this.loading=true
    this.loginService.login(this.form.value).subscribe(
  (res)=>{
    console.log(res);
    this.userInfo={userName:res.contactName,
                  organizationName:res.organisationName,
                  id:res.id,
                  email:res.email
                }
    this.authService.saveDataToLocalStorage(this.userInfo);
    localStorage.setItem("token",res.token)

   // Store the refresh token in a cookie
   this.loginService.storeRefreshTokenInCookie(res.refreshToken);
   this.refreshToken();

    // check autheraization

    if(!res.isEmailAuthonticated){
      console.log("navigate to verification")
      this.sendCode();
      this.router.navigateByUrl('verification')

    }
    if(res.isEmailAuthonticated && (res.isActive || res.isTrial)){
      console.log("navigate to messages")
      this.router.navigateByUrl('messages')

    }
       // Refresh the token every 1 hour

   setInterval(() => {
    this.refreshToken();
  }, 60 * 60 * 1000); // 1 hour in milliseconds
    console.log("invalid")
    this.invalid=(!res.isActive && !res.isTrial)?true:false

this.invalid=false;




  },
  (err)=>{
    this.loading=false;
    this.invalid=true;

  }
)

  }


  refreshToken() {
    let token=this.loginService.getCookieValue('refreshToken')
    this.loginService.refreshToken(token).subscribe(
      (res) => {
        // Update the refresh token in the cookie
        this.loginService.storeRefreshTokenInCookie(res.refreshToken);
      },
      (err) => {
      }
    );
  }

  sendCode(){
    this.loginService.sendEmailCode(this.form.value.email).subscribe(

      (res)=>{

        this.loading=false;

      },
      (err)=>{
        this.loading=false;
      }
    )

  }




}

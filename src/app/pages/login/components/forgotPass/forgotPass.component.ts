import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PluginsService } from 'src/app/services/plugins.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-forgotPass',
  templateUrl: './forgotPass.component.html',
  styleUrls: ['./forgotPass.component.scss']
})
export class ForgotPassComponent implements OnInit ,OnDestroy{

  email:any ;
  form: FormGroup;
  loading:boolean;
  
    constructor(private plugin:PluginsService,
      private authService:AuthService,
      private loginService:LoginService,
      private router:Router,
      ) {
  
        window.addEventListener('beforeunload', this.backToLogin);
      }
    
      backToLogin(){
        this.router.navigateByUrl("/login")
      }
    
      ngOnDestroy() {
        // Remove the event listener when the component is destroyed
        window.removeEventListener('beforeunload', this.backToLogin);
      }
    ngOnInit() {
      this.email=new FormControl('',[Validators.required,Validators.pattern(this.plugin.emailReg)]);
      this.form=new FormGroup(
        {
          email:this.email,
        }
      )
    }
    sendCode(){
      // this.sendCodeToEmail();
      // this.authService.setFromValue("forgot")
      // this.authService.setEmail(this.form.value.email)
      // this.router.navigateByUrl('verification')

      this.loading=true;
      this.sendCodeToEmail().subscribe(
  
        (res)=>{
          this.authService.setFromValue("forgot")
          this.authService.setEmail(this.form.value.email)
          this.router.navigateByUrl('verification')
          this.loading=false;
  
        }, 
        (err)=>{
          this.loading=false;
        }
      );
     

    }
    returnToLogin(){
      this.router.navigateByUrl("login")

    }
    sendCodeToEmail(){
      
      return this.loginService.sendEmailCode(this.form.value.email)
     
  
    }
}

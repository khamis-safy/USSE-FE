import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PluginsService } from 'src/app/services/plugins.service';
import { ResetPassService } from './reset.service';
import { TranslateService } from '@ngx-translate/core';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit ,OnDestroy{
  form:any;
  loading;
  password:any;
  confirmPass:any;
  constructor( private plugin:PluginsService,
     private router:Router,
    private authService:AuthService,
    private resetPassService:ResetPassService,
    private translate:TranslateService,
    private toaster:ToasterServices) {   window.addEventListener('beforeunload', this.backToLogin);
  }

 

  ngOnDestroy() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener('beforeunload', this.backToLogin);
  }
  ngOnInit() {
       // controls
       this.initFormControles()
       //form creation
       this.createForm();
  }
  initFormControles(){
    this.password = new FormControl('',[Validators.required,Validators.pattern(this.plugin.passReg)]);
    this.confirmPass = new FormControl('',[Validators.required,Validators.pattern(this.plugin.passReg)]);

  }
  createForm(){
    this.form = new FormGroup({
      password: this.password,
      confirmPass: this.confirmPass

    })
  }
  confirm(){
    this.loading=true;
    this.resetPassService.changePassword(this.authService.getEmail(),this.authService.getCode(),this.form.value.password).subscribe(
      (res)=>{
        this.toaster.success(this.translate.instant('PASS_CHANGED'))
        this.router.navigateByUrl("/login")

      }
    )
    
  }
  backToLogin(){
    this.router.navigateByUrl("/login")
  }
}

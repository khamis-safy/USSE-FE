import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PluginsService } from 'src/app/services/plugins.service';
import { ResetPassService } from './reset.service';
import { TranslateService } from '@ngx-translate/core';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { Subscription, from } from 'rxjs';

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
  supscription:Subscription;
  valid: boolean;
  constructor( private plugin:PluginsService,
     private router:Router,
    private authService:AuthService,
    private resetPassService:ResetPassService,
    private translate:TranslateService,
    private toaster:ToasterServices) {   window.addEventListener('beforeunload', this.backToLogin);
  }

 

  ngOnDestroy() {
    this.supscription.unsubscribe()
    // Remove the event listener when the component is destroyed
    window.removeEventListener('beforeunload', this.backToLogin);
    
  }
  ngOnInit() {
       // controls
       this.initFormControles()
       //form creation
       this.createForm();
this.supscription=this.form.valueChanges.subscribe(
(res)=>{
  if(this.form.get('password').value ===this.form.get('confirmPass').value){
    this.valid=true;
  }
  else{
    this.valid=false;
  }
}
)
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
    const encodedValue = encodeURIComponent(this.form.get('password').value);
    this.resetPassService.changePassword(this.authService.getEmail(),this.authService.getCode(),encodedValue).subscribe(
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

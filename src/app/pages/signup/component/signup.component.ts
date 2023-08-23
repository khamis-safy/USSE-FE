import { SignupService } from './../signup.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PluginsService } from 'src/app/services/plugins.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isVisiblePass =false;
  isLoading = false

  form:any;
  contactName:any;
  organisationName:any;
  email:any;
  password:any;
  confirm:any;
  loading;

  constructor(private plugin:PluginsService,
    private signupService:SignupService,
    private router:Router
    ) { }

  ngOnInit(): void {
    // controls
    this.initFormControles()
    //form creation
    this.createForm();
  }
  initFormControles(){
    this.contactName = new FormControl('',[Validators.required]);
    this.organisationName = new FormControl('');
    this.email = new FormControl('',[Validators.required,Validators.pattern(this.plugin.emailReg)]);
    this.password = new FormControl('',[Validators.required,Validators.pattern(this.plugin.passReg)]);
    this.confirm = new FormControl('',[Validators.required,Validators.pattern(this.plugin.passReg)]);

  }
  createForm(){
    this.form = new FormGroup({
      contactName: this.contactName ,
      organisationName: this.organisationName ,
      email: this.email ,
      password: this.password,
      confirm: this.confirm

    })
  }
  signUp(){
    this.isLoading =true;

    const data={
      contactName: this.contactName.value ,
      organisationName: this.contactName.value ,
      email: this.email.value ,
      password: this.password.value
    }
    this.signupService.register(data).subscribe(
      (res)=>{
        this.isLoading =false;
        this.router.navigate(['/login'])
      },
      (err)=>{
        this.isLoading =false;

      }
    )
  }


}

// pass ["aaddsDD@dsfd23"],


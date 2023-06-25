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

  es_form:any;
  contactName:any;
  organisationName:any;
  email:any;
  password:any;

  constructor(private plugin:PluginsService,
    private myService:SignupService,
    private router:Router
    ) { }

  ngOnInit(): void {
    // controls
    this.initFormControles()
    //form creation
    this.createForm();
  }
  initFormControles(){
    this.contactName = new FormControl('',[Validators.required,Validators.pattern(this.plugin.textReg)]);
    this.organisationName = new FormControl('',[Validators.required,Validators.pattern(this.plugin.textReg)]);
    this.email = new FormControl('',[Validators.required,Validators.pattern(this.plugin.emailReg)]);
    this.password = new FormControl('',[Validators.required,Validators.pattern(this.plugin.passReg)]);
  }
  createForm(){
    this.es_form = new FormGroup({
      contactName: this.contactName ,
      organisationName: this.organisationName ,
      email: this.email ,
      password: this.password
    })
  }
  submit(){
    this.isLoading =true;
    this.es_form.value.permissions = [
      {
        name: "",
        value: ""
      }
    ]
    this.myService.register(this.es_form.value).subscribe(
      (res:any)=>{
        this.isLoading =false;
        console.log(res)
        this.router.navigate(['/login'])
      },
      (err:any)=>{
        this.isLoading =false;
        console.log(err)
        this.router.navigate(['/messages'])
      }
    )
  }
}
// pass ["dsfdsDD@dsfd23"],
// [
//   {
//     "message": null,
//     "isAuthenticated": true,
//     "email": "sda@fff.com",
//     "roles": [
//       "Customer"
//     ],
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzZGFAZmZmLmNvbSIsImp0aSI6ImZkMjliZmUxLTc0ZGYtNDZhNi1hY2NlLTM2NzNhMzAwNmQ1YyIsImVtYWlsIjoic2RhQGZmZi5jb20iLCJ1aWQiOiJjNGFkMmEwOS02MDNlLTRjYzktYTMzMi03NWM0NGFiMjdiNDEiLCJyb2xlcyI6IkN1c3RvbWVyIiwiZXhwIjoxNjgxNjA2NjY3LCJpc3MiOiJTZWN1cmVBcGkiLCJhdWQiOiJTZWN1cmVBcGlVc2VyIn0.JGgEvFWLrPT5DCXSg7K51nCzbnOp2erbWcMRcd24x1o",
//     "refreshTokenExpiration": "2023-04-16T00:57:47.1521939Z",
//     "contactName": "string",
//     "organisationName": "string",
//     "trialEndDate": "2023-06-15T22:57:45.7362185Z",
//     "isActive": false,
//     "isTrial": true,
//     "customerId": "",
//     "partnerId": null,
//     "users": null,
//     "devices": null,
//     "apiToken": "121609a4-11c0-4964-8526-46d41036c516",
//     "apiId": "758c7093-3635-435d-b23b-884ed5cc0ccf",
//     "isEmailAuthonticated": false,
//     "subscriptions": [
//       {
//         "name": "SUBSCRIPTION",
//         "value": "S1"
//       },
//       {
//         "name": "USERS",
//         "value": "0"
//       },
//       {
//         "name": "DEVICES",
//         "value": "1"
//       },
//       {
//         "name": "BOTS",
//         "value": "0"
//       }
//     ]
//   }
// ]

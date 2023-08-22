import { Component, OnInit} from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit{
email:any =new FormControl('',[Validators.required]);
password:any =new FormControl('',[Validators.required])
form=new FormGroup(
  {
    email:this.email,
    password:this.password
  }
)
loading;

  constructor(private authService:AuthService,private loginService:LoginService,private router:Router) {

  }
  ngOnInit() {

  }
  login(){
    this.loading=true
    this.loginService.login(this.form.value).subscribe(
  (res)=>{
    console.log(res);
    this.authService.userData=res;
this.refreshToken()
    // check autheraization
    if(!res.isEmailAuthonticated){
      this.router.navigateByUrl('verification')

        this.sendCode();
    }
    else{
      this.loading=false;

    }

    this.refreshToken()

  },
  (err)=>{
    console.log(err);
    this.loading=false

  }
)

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

  // refreshToken(){
  //   setInterval(()=>{
  //     this.loginService.refreshToken().subscribe(
  //       (res)=>{
  // // store token in cookiel
  // console.log("working")
  //       },
  //       (err)=>{
  //         console.log(err);

  //       }
  //     )
  //   },5000)


  // }

  refreshToken(){
    this.loginService.refreshToken().subscribe(
            (res)=>{
      // store token in cookiel
      console.log("working")
            },
            (err)=>{
              console.log(err);

            }
          )

  }
}


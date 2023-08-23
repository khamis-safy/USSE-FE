import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VerifyService } from './verify.service';
import { LoginService } from '../../login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit ,AfterViewInit{
  verificationForm: FormGroup;

  digitIndexes: number[] = [0, 1, 2, 3, 4, 5];
  loading: boolean;

  constructor(private loginService:LoginService,private authService:AuthService,private router:Router,private formBuilder: FormBuilder,private verificatioinService:VerifyService) {
    this.verificationForm = this.formBuilder.group({
      digit0: ['', Validators.required],
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required]
    });
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setFocus(0);
  }

  onDigitInput(event: any, digitIndex: number) {
    const nextDigitIndex = digitIndex + 1;

    const enteredDigit = event.target.value;
    if (!isNaN(enteredDigit) && enteredDigit.length === 1) {
      this.verificationForm.controls[`digit${digitIndex}`].setValue(enteredDigit);

      if (nextDigitIndex < this.digitIndexes.length) {
        this.setFocus(nextDigitIndex);
      }
    }

    this.checkVerificationCode();
  }

  getCookieValue(cookieName: string): string {
    const cookies = document.cookie.split(';');
    console.log("cookie value",document.cookie)
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        console.log("cookie valu",decodeURIComponent(value))
        return decodeURIComponent(value);
      }
    }
    return '';
  }
  setFocus(digitIndex: number) {
    const inputId = `digitInput${digitIndex}`;
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }
  onKeyDown(event: KeyboardEvent, digitIndex: number) {
    if (event.key === 'Backspace') {
      this.onDeleteKey(digitIndex);
    }
  }

  onDeleteKey(digitIndex: number) {
    const prevDigitIndex = digitIndex - 1;

    if (prevDigitIndex >= 0) {
      this.verificationForm.controls[`digit${digitIndex}`].setValue('');

      this.setFocus(prevDigitIndex);
    }
  }

  checkVerificationCode() {
    const code = Object.keys(this.verificationForm.controls)
      .map(key => this.verificationForm.controls[key].value)
      .join('');

    if (code.length === 6) {
      // Send verification request using code
      const token =this.getCookieValue('refreshToken');

      // const token=localStorage.getItem("token");
      console.log(code)
      this.verificatioinService.confirmEmail(code,token).subscribe(
        (res)=>{
          console.log(res);
          this.router.navigateByUrl("messages");
        },
        (err)=>{
          console.log(err)
        }
      )

      // console.log('Sending verification request with code:', code,"token",token);
    }
  }
  reSendCode(){
    const email=this.authService.userData.email;
    this.loading=true;
    this.verificationForm.setValue({
      digit0: '',
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      digit5: ''
    });
    this.loginService.sendEmailCode(email).subscribe(

      (res)=>{

        this.loading=false;

      },
      (err)=>{
        this.loading=false;
      }
    )

  }
}

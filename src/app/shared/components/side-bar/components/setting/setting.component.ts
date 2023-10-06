import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToasterServices } from '../../../us-toaster/us-toaster.component';
import { TranslateService } from '@ngx-translate/core';
import { TIMEZONES } from './constants/constant';

@Component({

    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],

})
export class SettingComponent implements OnInit{
  contactName:any = new FormControl('',[Validators.required]);
  apiToken:any = new FormControl({value:'',  disabled: true});
  mobile:any = new FormControl('');
  organisationName:any = new FormControl('',[Validators.required]);
  maskType:any=new FormControl([]);
  timeZone:any=new FormControl([]);

  // ngx-intl-tel
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  maskValue:any;
  form = new FormGroup({
    contactName:this.contactName,
    apiToken:this.apiToken,
    mobile:this.mobile,
    organisationName:this.organisationName,
    maskType:this.maskType,
    timeZone:this.timeZone,

  });
  selectedZone:any;
  timeZoneArr:SelectOption[];
  timeZones:any[] =TIMEZONES
  maskTypeArr:SelectOption[] ;
  loading;
  userInfo: any;
  isUser:boolean;
    constructor(public dialogRef: MatDialogRef<SettingComponent>,
      private translate:TranslateService,
      private authService:AuthService,
      private toaster:ToasterServices) {
     this.maskTypeArr=[
      {title:translate.instant('Sender'),value:'S'},
      {title:translate.instant('Receiver'),value:'R'},
      {title:translate.instant('Both'),value:'A'},
      {title:translate.instant('None'),value:'N'}
    ]
      this.maskValue=this.maskTypeArr.find((res)=>res.value==localStorage.getItem("maskType"));
    this.timeZoneArr=this.timeZones.map((timezone)=>{return{
      title:`${translate.instant(timezone.title)} `,
      value:timezone.index
    }})

     }
  ngOnInit(): void {
    if(localStorage.getItem("customerId")==""){
      this.isUser=false;

    }
    else{
      this.isUser=true;

    }

    let phoneNumber = localStorage.getItem('phoneNumber');

    let mobileNum = phoneNumber !== "null" && phoneNumber !== "undefined" ? phoneNumber.slice(1) : "";
    this.form.patchValue(
      {
        contactName:localStorage.getItem('userName'),
        mobile:mobileNum,
        apiToken:localStorage.getItem('apiToken'),
        organisationName:localStorage.getItem('organizationName'),
        maskType:{title:this.translate.instant(this.maskValue.title),value:this.maskValue.value},

      }
    )
    let timeZone=localStorage.getItem("timeZone")
    this.selectedZone=timeZone !== "null" && timeZone !== "undefined"? timeZone:null;
    this.form.patchValue({
      timeZone:
      {title:this.translate.instant(this.timeZones.find((time)=>time.value==this.selectedZone).title),
        value:this.timeZones.find((time)=>time.value==this.selectedZone).index}
    })
  }
  generateGuid() {
    this.form.patchValue(
      {
        apiToken:this.generateRandomGuid()
      }
    )
  }

  generateRandomGuid(): string {
    // Generate a random 8-character hexadecimal string
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    // Concatenate four random hexadecimal strings with hyphens
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
  }
  copyToClipboard() {
    // Check if the API token is present and not empty
    console.log(this.apiToken)
    const textToCopy = this.apiToken.value;
    if (!textToCopy) {
      alert('No API token to copy.'+this.form.value);
      return;
    }

    // Create a temporary input element to copy text
    const tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);

    try {
      // Select and copy the text from the temporary input element
      tempInput.select();
      document.execCommand('copy');
      alert('API token copied to clipboard!');
    } catch (err) {
      console.error('Unable to copy API token:', err);
      alert('An error occurred while copying the API token. Please copy it manually.');
    } finally {
      // Remove the temporary input element
      document.body.removeChild(tempInput);
    }
  }
  onSelect(zone){

this.selectedZone=this.timeZones.find((time)=>time.index==zone.value).value;
console.log("selected zone",this.selectedZone)

        }
    submitSave() {
      this.loading=true;
      let mobile=this.form.value.mobile? this.form.value.mobile.e164Number:null;
      const data=this.selectedZone?{
        token: this.authService.getUserInfo().refreshToken,
        apiToken: this.apiToken.value,
        contactName: this.form.value.contactName,
        organisationName: this.form.value.organisationName,
        timeZone: this.selectedZone,
        maskType: this.form.value.maskType.value,
        phoneNumber: mobile
      }:{
        token: this.authService.getUserInfo().refreshToken,
        apiToken: this.apiToken.value,
        contactName: this.form.value.contactName,
        organisationName: this.form.value.organisationName,
        maskType: this.form.value.maskType.value,
        phoneNumber: mobile
      }

      this.authService.editProfile(data).subscribe(
        (res)=>{
          this.loading=false;

          this.toaster.success(this.translate.instant('COMMON.SUCC_MSG'));
          this.userInfo={userName:res.contactName,
            organizationName:res.organisationName,
            id:res.id,
            email:res.email,
            token:localStorage.getItem("token"),
            customerId:res.customerId,
            apiToken:res.apiToken,
            maskType:res.maskType,
            phoneNumber:res.phoneNumber,
            timeZone:this.selectedZone
          }
      this.authService.saveDataToLocalStorage(this.userInfo);
      this.authService.updateUserInfo()
      this.onClose(true);
        },
        (err)=>{
          this.loading=false;
          this.onClose()
        }
      )
        // this.onClose()
    }

    onClose(data?): void {
        this.dialogRef.close(data);
    }
    isValid(){
      if(this.isUser){
return !this.contactName.valid
      }
      else{
return this.form.invalid
      }
    }
}

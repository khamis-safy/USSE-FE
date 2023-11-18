import { Component, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { CompaignsService } from '../../compaigns.service';
import { WriteMessageComponent } from 'src/app/pages/messages/Components/new-message/write-message/write-message.component';
import { StepThreeComponent } from './stepThree/stepThree.component';
import { StepFourComponent } from './stepFour/stepFour.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CampaignActionsComponent } from './campaign actions/component/campaignActions/campaignActions.component';
// import { WriteMessageComponent } from 'src/app/pages/messages/Components/new-message/write-message/write-message.component';
@Component({
  selector: 'app-addCompaigns',
  templateUrl: './addCompaigns.component.html',
  styleUrls: ['./addCompaigns.component.scss']
})

export class AddCompaignsComponent implements OnInit {
  attachments:string[]=[];
  @ViewChild(WriteMessageComponent) writeMessage:WriteMessageComponent;
  @ViewChild(StepThreeComponent) stepThreeComponent:StepThreeComponent;
  @ViewChild(StepFourComponent) stepFourComponent:StepFourComponent;
  @ViewChild(CampaignActionsComponent) campaignActions:CampaignActionsComponent;

  @Output() back = new EventEmitter<boolean>;
  isLoading = false;
  isRepeatable: boolean;
  isInterval:boolean;
  repeatedDays: number;
  intervalFrom: number;
  intervalTo: number;
  blackoutFrom: any;
  blackoutTo: any;
  maxPerDay: number;
  message:string="";
  lists:string[]=[];
  dateTime:string;
  deviceId:string;
  compaignName:string;
  numErr:number=0;
  stepTwoValidate: boolean = true;
  stepThreeValidate: boolean = true;
  stepFourValidate: boolean = true;
  deviceSelected:boolean=false;
  step1:boolean=true;
step2:boolean=false;
step3:boolean=false;
step4:boolean=false;
sendingTimeOutFrom:any;
sendingTimeOutTo:any;
lastCampaignData:{
  intervalFrom:number,
  intervalTo:number,
  repeatedDays:number,
  isRepeatable:boolean,
  isInterval:boolean,
  maxPerDay:number,
  sendingoutFrom:any,
  sendingoutTo:any

};
  showWarningMsg: boolean=false;


  constructor(private compaignsService:CompaignsService,private toasterService:ToasterServices,private authService:AuthService){
  }
  ngOnInit() {
this.getLastCampaignData();
  }
  getLists(listsData){
    this.lists=listsData.map((list)=>list.id);
  }
  filesUrls(e){
    this.attachments=e;
  }
  stepTwoValidation(validity: boolean) {
    this.stepTwoValidate = validity;
  }
  stepThreeValidation(validity: boolean) {
    this.stepThreeValidate = validity;
  }
  stepFourValidation(validity: boolean) {
    this.stepFourValidate = validity;
  }

toSecondStep(){
  this.step2=true;


}

toThirdStep(data){
  this.step3=true;
  this.message=data.message;
  this.attachments=data.files
  // this.message=this.writeMessage.form.value.message;

  // this.attachments=this.writeMessage.fileData.map((file)=>file.url);

}
getLastCampaignData(){
  this.compaignsService.getLastCampaign(this.authService.getUserInfo().email).subscribe(
    (res)=>{
      if(res){
       this.lastCampaignData=res;
       this.lastCampaignData.sendingoutFrom=this.convertUTCToLocal(this.lastCampaignData.sendingoutFrom)
       this.lastCampaignData.sendingoutTo=this.convertUTCToLocal(this.lastCampaignData.sendingoutTo)
      }
 
      
    }
  )
}
toStepFour(){
  this.step4=true;
  this.deviceId=this.stepThreeComponent.deviceId?this.stepThreeComponent.deviceId:"";
  this.dateTime=`${this.stepThreeComponent.utcDateTime}Z`;
  this.compaignName=this.stepThreeComponent.form.value.compainName;
 
}
toStepFive(){
  this.isRepeatable=this.stepFourComponent.isRepeatable;
  this.isInterval=this.stepFourComponent.isInterval;
  
  this.repeatedDays=this.stepFourComponent.form.get("repeatedDays").value;
  this.intervalFrom=this.stepFourComponent.form.get("intervalFrom").value;
  this.intervalTo=this.stepFourComponent.form.get("intervalTo").value;
  this.blackoutFrom=this.stepFourComponent.utcTime1;
  this.blackoutTo=this.stepFourComponent.utcTime2;
  this.maxPerDay=this.stepFourComponent.form.get("maxPerDay").value;
  this.stepFourComponent.convertToUTC(this.blackoutFrom);
}
addCampaign(){
this.isLoading = true;

const data={
  campaignName: this.compaignName,
  scheduledAt: this.dateTime,
  isRepeatable: this.isRepeatable,
  repeatedDays: this.repeatedDays,
  intervalFrom: this.intervalFrom,
  intervalTo: this.intervalTo,
  sendingoutFrom: this.blackoutFrom,
  sendingoutTo: this.blackoutTo,
  maxPerDay: this.maxPerDay,
  attachments: this.attachments,
  lists: this.lists,
  email: this.authService.getUserInfo()?.email,
  msgBody: this.message,
  deviceId: this.deviceId,
  isInterval: this.isInterval,
  sessionTimeOutMessage: "time out",
  sessionTimeOutMinutes: 2,
  actions:this.campaignActions.getActions()
}

// Filter the object keys based on values or non-empty arrays
const filteredKeys = Object.keys(data).filter(key => {
  const value = data[key];

  // Check if the value is not an empty array, not null, and not undefined
  return !((Array.isArray(value) && value.length === 0) || value === null || value === undefined);
});

// Create a new object with only the filtered keys
const filteredData = filteredKeys.reduce((acc, key) => {
  acc[key] = data[key];
  return acc;
}, {});

if(this.attachments.length>0){
  this.showWarningMsg=true;
}
else{
  this.showWarningMsg=false;

}
// console.log(filteredData);

this.compaignsService.addMewCampain(filteredData).subscribe(
  (res)=>{
    this.toasterService.success("Success");
    this.back.emit(true)
    this.isLoading = false
    
  },
  (err)=>{

    this.back.emit(false)
    this.isLoading = false;
    
  }


)

}
convertUTCToLocal(utcTime: string): Date {
  const [hoursStr, minutesStr] = utcTime.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const utcDate = new Date();
  utcDate.setUTCHours(hours, minutes);
  // Convert UTC time to local time
  return utcDate;
}
  }


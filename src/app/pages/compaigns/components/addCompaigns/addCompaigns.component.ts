import { Component, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { CompaignsService } from '../../compaigns.service';
import { WriteMessageComponent } from 'src/app/pages/messages/Components/new-message/write-message/write-message.component';
import { StepThreeComponent } from './stepThree/stepThree.component';
import { StepFourComponent } from './stepFour/stepFour.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
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
  message:string;
  lists:string[]=[];
  dateTime:string;
  deviceId:string;
  compaignName:string;
  numErr:number=0;
  childFormValidity: boolean = true;
  constructor(private compaignsService:CompaignsService,private toasterService:ToasterServices){}
  ngOnInit() {
  }
  getLists(listsData){
    this.lists=listsData.map((list)=>list.id);
  }
  filesUrls(e){
    this.attachments=e;
  }
  updateChildFormValidity(validity: boolean) {
    this.childFormValidity = validity;
  }
toSecondStep(){
  console.log("selected lists",this.lists);
  this.writeMessage.getTemplates();

}
toThirdStep(){
  this.stepThreeComponent.getDevices();
  this.message=this.writeMessage.form.value.message;
  this.stepThreeComponent.setDefaultTime();

  this.attachments=this.writeMessage.fileData.map((file)=>file.url);

}
toLastStep(){
  this.deviceId=this.stepThreeComponent.deviceId?this.stepThreeComponent.deviceId:"";
  this.dateTime=`${this.stepThreeComponent.utcDateTime}Z`;
  this.compaignName=this.stepThreeComponent.form.value.compainName;
  this.stepFourComponent.setDefaultTime();

}
addCampaign(){
this.isRepeatable=this.stepFourComponent.isRepeatable;
this.isInterval=this.stepFourComponent.isInterval;

this.repeatedDays=this.stepFourComponent.form.get("repeate").value;
this.intervalFrom=this.stepFourComponent.form.get("intFrom").value;
this.intervalTo=this.stepFourComponent.form.get("intTo").value;
this.blackoutFrom=this.stepFourComponent.utcTime1;
this.blackoutTo=this.stepFourComponent.utcTime2;
this.maxPerDay=this.stepFourComponent.form.get("rNum").value;
this.stepFourComponent.convertToUTC(this.blackoutFrom);
let data;
if(this.attachments.length==0){
  data={
    campaignName: this.compaignName,
    scheduledAt: this.dateTime,
    isRepeatable: this.isRepeatable,
    repeatedDays: this.repeatedDays,
    intervalFrom: this.intervalFrom,
    intervalTo: this.intervalTo,
    sendingoutFrom: this.blackoutFrom,
    sendingoutTo: this.blackoutTo,
    maxPerDay: this.maxPerDay,
    lists: this.lists,
    email: this.compaignsService.email,
    msgBody: this.message,
    deviceId: this.deviceId,
    isInterval: this.isInterval
  }
}
else{

data={
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
  email: this.compaignsService.email,
  msgBody: this.message,
  deviceId: this.deviceId,
  isInterval: this.isInterval
}


}




this.compaignsService.addMewCampain(data).subscribe(
  (res)=>{
    this.toasterService.success("Success");
    this.back.emit(true)
    this.isLoading = false
    console.log(res)},
  (err)=>{

    this.back.emit(false)
    this.isLoading = false;
    console.log(err)}


)

}

  }


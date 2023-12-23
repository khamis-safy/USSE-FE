import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { CampaignActionsComponent } from 'src/app/pages/compaigns/components/addCompaigns/campaign actions/component/campaignActions/campaignActions.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AutomationNameComponent } from './steps/automation-name/automation-name.component';
import { DetailsComponent } from './steps/details/details.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { BotService } from '../../bot.service';
import { Automation } from '../../interfaces/automation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-automation',
  templateUrl: './new-automation.component.html',
  styleUrls: ['./new-automation.component.scss']
})
export class NewAutomationComponent implements OnInit {
  @Output() back = new EventEmitter<boolean>;
  @ViewChild(AutomationNameComponent) automationNameComponent:AutomationNameComponent;
  @ViewChild(DetailsComponent) detailsComponent:DetailsComponent;
  @ViewChild(CampaignActionsComponent) campaignActions:CampaignActionsComponent;
  isCampaignAction:boolean=false;
  botActions:any=[];
  isLoading:boolean;
  deviceID:string;
  isEditAutomation:boolean;
  @Input() automationData:Automation;
  automationName:string="";
  constructor(private authService:AuthService,
    private compaignsService:CompaignsService,
    private toasterService:ToasterServices,
    private translate:TranslateService,
    private  toaster: ToasterServices,
    private botService:BotService) { }

  ngOnInit() {
    if(this.automationData){
      this.isEditAutomation=true;
      this.automationName=this.automationData.name;
    }
    else{
      this.isEditAutomation=false;
    }
  }
  setDeviceId(event){
    this.deviceID=event;
 
    this.isCampaignAction=true;

  }
  setActions(event){
this.botActions=event
  }
  addAutomation(){
    this.isLoading = true;

    let data:any={
      email:  this.authService.getUserInfo()?.email,
      name: this.automationNameComponent.form.value.automationName,
      deviceid: this.detailsComponent.deviceId,
      sessionTimeOutMinutes: this.detailsComponent.form.value.sessionTimeOut,
      sessionTimeOutResponseContent: this.detailsComponent.form.value.message,
      botActions:this.botActions,
      criterias:this.automationNameComponent.criterias
    }
    // console.log(this.compaignsService.filteredObject(data));
if(this.automationData){
  data.id=this.automationData.id;
  data.sessionTimeOutResponseContent=this.detailsComponent.form.value.message || "" 
  this.botService.updateAutomation(data).subscribe(
    (res)=>{
      this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
      this.back.emit(true)
      this.isLoading = false
    },
    (err)=>{
      this.back.emit(true)
      this.isLoading = false;
    }
  )
}
else{
  this.botService.createNewAutomation(this.compaignsService.filteredObject(data)).subscribe(
    (res)=>{
      this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
      this.back.emit(true)
      this.isLoading = false
    },
    (err)=>{
      this.back.emit(true)
      this.isLoading = false;
    }
  )
}

  }
}

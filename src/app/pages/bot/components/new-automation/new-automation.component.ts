import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';
import { CampaignActionsComponent } from 'src/app/pages/compaigns/components/addCompaigns/campaign actions/component/campaignActions/campaignActions.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AutomationNameComponent } from './steps/automation-name/automation-name.component';
import { DetailsComponent } from './steps/details/details.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { BotService } from '../../bot.service';

@Component({
  selector: 'app-new-automation',
  templateUrl: './new-automation.component.html',
  styleUrls: ['./new-automation.component.scss']
})
export class NewAutomationComponent implements OnInit {
  @Output() back = new EventEmitter<boolean>;
  @ViewChild(AutomationNameComponent) automationNameComponent:AutomationNameComponent;
  @ViewChild(DetailsComponent) detailsComponent:DetailsComponent;
  botActions:any=[];
  isLoading:boolean;
  constructor(private authService:AuthService,
    private compaignsService:CompaignsService,
    private toasterService:ToasterServices,
    private botService:BotService) { }

  ngOnInit() {
  }
  setActions(event){
this.botActions=event
  }
  addAutomation(){
    this.isLoading = true;

    const data={
      email:  this.authService.getUserInfo()?.email,
      name: this.automationNameComponent.form.value.automationName,
      deviceid: this.detailsComponent.deviceId,
      sessionTimeOutMinutes: this.detailsComponent.form.value.sessionTimeOut,
      sessionTimeOutResponseContent: this.detailsComponent.form.value.message,
      botActions:this.botActions,
      criterias:this.automationNameComponent.criterias
    }
    // console.log(this.compaignsService.filteredObject(data));

this.botService.createNewAutomation(this.compaignsService.filteredObject(data)).subscribe(
  (res)=>{
    this.toasterService.success("Success");
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

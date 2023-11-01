import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessagesService } from '../../messages.service';
import { CompaignsDetailsService } from 'src/app/pages/compaigns/components/compaignsDetails/compaignsDetails.service';
import { TranslateService } from '@ngx-translate/core';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
interface componentData{
  from:string,
  data:any
}
@Component({
  selector: 'app-resendMessages',
  templateUrl: './resendMessages.component.html',
  styleUrls: ['./resendMessages.component.scss']
})

export class ResendMessagesComponent implements OnInit {
  isLoading:boolean;
  
  constructor(public dialogRef: MatDialogRef<ResendMessagesComponent>,
      private messageService:MessagesService,
      private campaignDetialsService:CompaignsDetailsService,
      @Inject(MAT_DIALOG_DATA) public data: componentData,
      private translate:TranslateService,
      private toaster: ToasterServices,
   ) { }

  ngOnInit() {
   
  }
  resendCampainFailedMessages(){
    this.campaignDetialsService.resendCampaignFailedMessages(this.data.data).subscribe(
      (res) => {
        this.isLoading = false

        this.onClose(true);

        this.toaster.success(this.translate.instant("COMMON.SUCC_MSG"))
      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )
  }
  resendFailedMessages(){
    this.messageService.ressendFailedMessages(this.data.data).subscribe(
      (res) => {
        this.isLoading = false

        this.onClose(true);

        this.toaster.success(this.translate.instant("COMMON.SUCC_MSG"))
      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )
  }
  submit() {
this.isLoading=true;
if(this.data.from == "CampaignDetails"){
      this.resendCampainFailedMessages();
}
if(this.data.from=="messages"){
  this.resendFailedMessages()
}
  }

  onClose(data ?): void {
    this.dialogRef.close(data);
  }

}

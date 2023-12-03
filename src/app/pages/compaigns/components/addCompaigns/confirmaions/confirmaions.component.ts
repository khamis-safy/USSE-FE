import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompaignsService } from '../../../compaigns.service';
import { BotService } from 'src/app/pages/bot/bot.service';

@Component({
  selector: 'app-confirmaions',
  templateUrl: './confirmaions.component.html',
  styleUrls: ['./confirmaions.component.scss']
})
export class ConfirmaionsComponent implements OnInit {
  isLoading:boolean;
  isApply:boolean;
  isClear:boolean;
  constructor(public dialogRef: MatDialogRef<ConfirmaionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private campainService:CompaignsService,
    private botService:BotService
) { }

  ngOnInit() {
    if(this.data.action=='apply'){
      this.isApply=true;
      this.isClear=false;
    }
    else{
      this.isApply=false;
      this.isClear=true;
    }
  }
  applyActions(){
    if(this.data.isCampaignAction){
      this.campainService.getCampaignById(this.data.id).subscribe(
        (res)=>{
          let actions = res.actions;
          this.isLoading = false;
          this.onClose(actions)
  
        }
      )
    }
    else{
      this.botService.getAutomationById(this.data.id).subscribe(
        (res)=>{
          let actions = res.botActions;
          this.isLoading = false;
          this.onClose(actions)
  
        }
      )
    }
   
  }
  removeActions(){
    this.isLoading = false;
    this.onClose(true)
  }
 submit() {
    this.isLoading = true;
    if( this.isApply){
      this.applyActions()
    }
    else{
      this.removeActions();
    }
  }
    
  onClose(data?): void {
    this.dialogRef.close(data);
}
}

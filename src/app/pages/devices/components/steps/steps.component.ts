import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DevicesService } from '../../devices.service';
import { Subscription, interval, switchMap, takeUntil, timer } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';


@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit ,OnDestroy {

steps:boolean=true;
isLoading:boolean=false;
scann:boolean=false;
wBstatus:boolean=false;
initSuccB:boolean=false;
sessionNB:string="";
tokenB:string="";
qrCode:string="";
check;
private initSessionSubscription: Subscription;
private checkStatusSubscription: Subscription;
retryCounter:number = 0;

  constructor(private devicesService:DevicesService,
    private  toaster: ToasterServices,
    public dialogRef: MatDialogRef<StepsComponent>,
    ) { }

  ngOnInit() {

  }

scannCode(){
this.isLoading=true;
this.scann=false;
this.steps=false;
this.initSessionAndCheckStatus();


}


initSessionAndCheckStatus(){
  this.initSessionSubscription= this.devicesService.initWhatsAppB(this.sessionNB).subscribe(
  (res)=>{
          this.isLoading=false;
          this.scann=false;
          this.steps=false;

          this.sessionNB=res.sessionName;
          this.tokenB=res.token;
          this.initSuccB=res.isSuccess;

          let data='data:image/png;base64,';
          let code=res.base64.includes(data)? res.base64.replace(data,""):res.base64;

          this.qrCode=`${data}${code}`;

        this.checkStatus();


  },
  (err)=>{
    this.onClose()
    this.toaster.error("Error")

  }
)
}
checkWhatsappB(){
  if(this.wBstatus ){
    clearInterval(this.check);
    this.retryCounter=0;
    this.isLoading=false;
    this.scann=true;
    this.steps=false;
  }
  else if(!this.wBstatus&& this.retryCounter>=30){
    clearInterval(this.check);
    this.retryCounter=0;

    this.initSessionAndCheckStatus();

  }
}
checkStatus(){
    this.check=setInterval(()=>{

    this.checkStatusSubscription = this.devicesService.CheckWhatsappBisuness(this.sessionNB,this.tokenB).subscribe(
        (res)=>{
          this.wBstatus=res.status;
          this.retryCounter++;
          this.checkWhatsappB();
        },
        (err)=>{
          this.onClose()
          this.toaster.error("Error")
        }
      )
    },2000) ;
}
onClose() {
  this.dialogRef.close();
}

ngOnDestroy(): void {
  clearInterval(this.check);
  // Unsubscribe to avoid memory leaks
  this.initSessionSubscription?.unsubscribe();
  this.checkStatusSubscription?.unsubscribe();
}
}

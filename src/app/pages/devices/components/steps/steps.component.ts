import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../devices.service';


@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {

steps:boolean=true;
isLoading:boolean=false;

checkWBstatus:boolean=false;
initSuccB:boolean=false;
sessionNB:string;
tokenB:string;
  constructor(private devicesService:DevicesService) { }

  ngOnInit() {

  }

scannCode(){
  this.steps=false;
  this.isLoading=true
  this.initWhatsB("");
  let every60Seconds;
  let test = setTimeout(()=>{
    this.isLoading=false;
    this.steps=false;
  },2000)
  // if(!this.checkWBstatus && !this.isLoading){
  //   every60Seconds = setInterval(this.initWhatsB,60*1000)
  // }
  // else{
  //   clearInterval(every60Seconds)
  // }

}

initWhatsB(sessionName:string){
  console.log("init whatsapp buzziness")
  this.devicesService.initWhatsAppB(sessionName).subscribe(
    (res)=>{
      this.isLoading=false;
      this.sessionNB=res.sessionName;
      this.tokenB=res.token;
      this.initSuccB=res.isSuccess;

      this.checkWBSession();
      // this.checkWBSession(this.sessionNB,this.tokenB)
    },
    (err)=>{
      this.isLoading=false;
      console.log(err);}
  )
}

checkWBSession(){
  let  checkSucc=setInterval(this.checkWBSession,2000);
  if(!this.checkWBstatus){
    this.devicesService.CheckWhatsappBisuness(this.sessionNB,this.tokenB).subscribe(
      (res)=>{console.log("works",res.status);
              this.checkWBstatus=res.status;
    },
      (err)=>{console.log(err)}
    )
  }
  else{
    clearInterval(checkSucc)
  }

}


}

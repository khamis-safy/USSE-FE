import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DatePipe } from '@angular/common';
import { CompaignsService, DevicesPermissions } from '../../../compaigns.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-stepThree',
  templateUrl: './stepThree.component.html',
  styleUrls: ['./stepThree.component.scss']
})
export class StepThreeComponent implements OnInit ,OnDestroy{
  deviceLoadingText:string='Loading ...';
  @ViewChild("dateTime") dateTime!: ElementRef;

  permission:DevicesPermissions[];

  devices:SelectOption[];
  selectedDevices:string[]=[];
  devicesData:any = new FormControl([]);
  compainName:any = new FormControl('',[Validators.required]);
  deviceId:string;
  dateFormControl:any = new FormControl('');
  form = new FormGroup({
    devicesData:this.devicesData,
    compainName:this.compainName,
    dateFormControl:this.dateFormControl
  });
  utcDateTime;
  timeSub$;
  isUser: boolean;
  @Output() formValidityChange = new EventEmitter<boolean>(true);
  @Output() isSelectedDevices = new EventEmitter<boolean>(true);

  constructor(private devicesService:DevicesService,private datePipe: DatePipe,private compaignsService:CompaignsService,private authService:AuthService) { }
  ngOnDestroy(): void {

    this.timeSub$.unsubscribe()
  }


  ngOnInit() {
    this.getDevices()
    this.isSelectedDevices.emit(false);

    this.form.valueChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);

    });
    this.setDefaultTime();
    this.permission =this.compaignsService.devicesPermissions;
if(this.authService.userInfo.customerId!=""){
  this.isUser=true;
}
else{
  this.isUser=false;
}
    // this.getDevices();
    this.convertToUTC(this.dateFormControl)
    this.timeSub$ = this.dateFormControl.valueChanges.subscribe(res=>{
    this.convertToUTC(this.dateFormControl);


   });
  }

  deviceSelection(){
    if(this.deviceId)
    {
      return null
    }
    else{
      return { deviceSelection: true }
    }
  }
  convertToUTC(timecontrol) {
    const selectedTime =timecontrol.value;
    if (selectedTime) {
      this.utcDateTime = this.datePipe.transform(selectedTime,`yyyy-MM-ddTHH:mm:ss`, 'UTC');
    }

  }
  getDevices(){

    this.authService.getDevices(this.devicesService.email,10,0,"","").subscribe(
      (res)=>{
        let filterdDevices=this.isUser && this.permission? res.filter((dev)=>this.permission.find((devP)=>devP.deviceId==dev.id && devP.value=="FullAccess")):res;
        let activeDevices=filterdDevices.filter((r)=>r.isConnected)
        this.devices = activeDevices.map(res=>{
          return {
            title:res.deviceName,
            value:res.id
          }
        });
        if(this.authService.selectedDeviceId ==""){

          this.form.patchValue({
          devicesData: {
          title:this.devices[0]?.title,
          value:this.devices[0]?.value
          }

          })
        }
        else{
          let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId);
          if(selected){

            this.deviceId=this.authService.selectedDeviceId;
            this.form.patchValue({
              devicesData: {
              title:selected.title,
              value:selected?.value
              }
  
              })
          }
        }
        console.log(this.devices)
        if(activeDevices.length==0){
          this.deviceLoadingText='No Results'
        }
       },
       (err)=>{
        this.deviceLoadingText='No Results'

       })
  }
  setDefaultTime(){
    this.dateFormControl.setValue(new Date());

  }
  onSelect(event){
    this.authService.selectedDeviceId=event.value
    this.deviceId=event.value;
    this.isSelectedDevices.emit(true);

  }

}


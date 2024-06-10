import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DatePipe } from '@angular/common';
import { CompaignsService, DevicesPermissions } from '../../../compaigns.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TimeZoneServiceService } from 'src/app/shared/services/timeZoneService.service';

@Component({
  selector: 'app-stepThree',
  templateUrl: './stepThree.component.html',
  styleUrls: ['./stepThree.component.scss']
})
export class StepThreeComponent implements OnInit ,OnDestroy{
  deviceLoadingText:string=this.translate.instant('Loading')
  @ViewChild("dateTime") dateTime!: ElementRef;
  email:string=this.authService.getUserInfo()?.email;

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
  formSub$;
  isUser: boolean;
  @Output() formValidityChange = new EventEmitter<boolean>(true);
  @Output() isSelectedDevices = new EventEmitter<boolean>(true);
  sub: any;

  constructor( private translate:TranslateService,
    private devicesService:DevicesService,
    private datePipe: DatePipe,
    private compaignsService:CompaignsService,
    private authService:AuthService,
    private timeZoneService:TimeZoneServiceService

  
  ) { }
  ngOnDestroy(): void {

    this.timeSub$.unsubscribe();
    this.formSub$.unsubscribe()
    if(this.sub){
      this.sub.unsubscribe()
    }
  }


  ngOnInit() {
    this.setTimeZone();

    this.getDevices()
    this.isSelectedDevices.emit(false);

    this.formSub$= this.form.valueChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);

    });
    this.setDefaultTime();
    this.permission =this.compaignsService.devicesPermissions;
if(this.authService.getUserInfo()?.customerId!=""){
  this.isUser=true;
}
else{
  this.isUser=false;
}

  }
  setTimeZone(){
    this.sub = this.timeZoneService.timezone$.subscribe(
      res=> this.setDefaultTime()

    )
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
    const selectedTime =new Date(timecontrol.value);
    if (selectedTime) {
      const utcTime = new Date(selectedTime.getTime() - this.timeZoneService.getTimezone() * 60 * 60 * 1000);
      this.utcDateTime = this.datePipe.transform(utcTime,`yyyy-MM-ddTHH:mm:ss`);
    }
    
  }
  getDevices(){

    this.authService.getDevices(this.email,10,0,"","").subscribe(
      (res)=>{
        let filterdDevices=this.isUser && this.permission? res.filter((dev)=>this.permission.find((devP)=>devP.deviceId==dev.id && devP.value=="FullAccess")):res;
        let activeDevices=filterdDevices.filter((r)=>r.isConnected)
        this.devices = activeDevices.map(res=>{
          return {
            title:res.deviceName,
            value:res.id,
            deviceIcon:res.deviceType
          }
        });
        // if(this.authService.selectedDeviceId ==""){

        //   this.form.patchValue({
        //   devicesData: {
        //   title:this.devices[0]?.title,
        //   value:this.devices[0]?.value
        //   }

        //   })
        // }
        // else{
        //   let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId);
        //   if(selected){

        //     this.deviceId=this.authService.selectedDeviceId;
        //     this.form.patchValue({
        //       devicesData: {
        //       title:selected.title,
        //       value:selected?.value
        //       }
  
        //       })
        //   }
        // }
        // console.log(this.devices)
        if(activeDevices.length==0){
          this.deviceLoadingText=this.translate.instant('No Results')
        }
       },
       (err)=>{
        this.deviceLoadingText=this.translate.instant('No Results')

       })
  }
  setDefaultTime(){
    let currentTime = this.timeZoneService.getCurrentTime(this.timeZoneService.getTimezone());
    this.dateFormControl.setValue(currentTime);
    this.convertToUTC(this.dateFormControl)
  }
  onSelect(event){
    this.authService.selectedDeviceId=event.value
    this.deviceId=event.value;
    this.isSelectedDevices.emit(true);

  }

}


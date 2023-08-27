import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDateService } from '@nebular/theme';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit ,OnDestroy{
  @ViewChild("dateTime") dateTime!: ElementRef;
  devices:SelectOption[];
  deviceLoadingText:string='Loading ...';
  selectedDevices:string[]=[];
  devicesData = new FormControl([]);
  dateFormControl:any = new FormControl('');

  deviceId:string;
  form = new FormGroup({
    devicesData:this.devicesData,
    dateFormControl:this.dateFormControl
  });
utcDateTime;
timeSub$;

  constructor(private devicesService:DevicesService,private dateService:NbDateService<Date>,private datePipe: DatePipe) {

    // this.selectedDate=dateService.today();
   }

  ngOnInit() {
    // this.getDevices();
    this.convertToUTC(this.dateFormControl)
    this.timeSub$ = this.dateFormControl.valueChanges.subscribe(res=>{
     this.convertToUTC(this.dateFormControl);


    });
  }
  ngOnDestroy(): void {
    this.timeSub$.unsubscribe()
  }
  convertToUTC(timecontrol) {
    const selectedTime =timecontrol.value;
    if (selectedTime) {
      this.utcDateTime = this.datePipe.transform(selectedTime,`yyyy-MM-ddTHH:mm:ss`, 'UTC');
      console.log('UTC Time:', this.utcDateTime);
    }
    else {
      console.error('Selected time is null or undefined');
    }
  }
  getDevices(){

    this.devicesService.getDevices(this.devicesService.email,10,0,"","").subscribe(
      (res)=>{
        let activeDevices=res.filter((r)=>r.isConnected)
        this.devices = activeDevices.map(res=>{
          return {
            title:res.deviceName,
            value:res.id
          }
        });
        console.log(this.devices)
        if(activeDevices.length==0){
          this.deviceLoadingText='No Results'
        }
       },
       (err)=>{

       })
  }
  setDefaultTime(){
    this.dateFormControl.setValue(new Date());

  }
  onSelect(event){
    this.deviceId=event.value;
  }

}

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stepThree',
  templateUrl: './stepThree.component.html',
  styleUrls: ['./stepThree.component.scss']
})
export class StepThreeComponent implements OnInit ,OnDestroy{
  deviceLoadingText:string='Loading ...';
  @ViewChild("dateTime") dateTime!: ElementRef;


  devices:SelectOption[];
  selectedDevices:string[]=[];
  devicesData = new FormControl([]);
  compainName:any = new FormControl('',[Validators.required]);
  deviceId:string;
  form = new FormGroup({
    devicesData:this.devicesData,
    compainName:this.compainName
  });
  dateFormControl = new FormControl(new Date());
  utcDateTime;
  timeSub$;
  constructor(private devicesService:DevicesService,private datePipe: DatePipe) { }
  ngOnDestroy(): void {
    this.timeSub$.unsubscribe()
  }


  ngOnInit() {
    // this.getDevices();
    this.convertToUTC(this.dateFormControl)
    this.timeSub$ = this.dateFormControl.valueChanges.subscribe(res=>{
    this.convertToUTC(this.dateFormControl);


   });
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

    this.devicesService.getDevices("khamis.safy@gmail.com",10,0,"","").subscribe(
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

  onSelect(event){
    this.deviceId=event.value;
  }

}


import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

@Component({
  selector: 'app-stepThree',
  templateUrl: './stepThree.component.html',
  styleUrls: ['./stepThree.component.scss']
})
export class StepThreeComponent implements OnInit {
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
  constructor(private devicesService:DevicesService) { }


  ngOnInit() {
    this.getDevices();
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
        })
       },
       (err)=>{

       })
  }

  onSelect(event){
    this.deviceId=event.value;
  }

}

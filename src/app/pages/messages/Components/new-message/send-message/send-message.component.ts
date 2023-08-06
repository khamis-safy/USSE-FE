import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  devices:SelectOption[];
  selectedDevices:string[]=[];
  devicesData = new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData
  });
  constructor(private devicesService:DevicesService) { }

  ngOnInit() {
    this.getDevices();
  }

  getDevices(){

    this.devicesService.getDevices("khamis.safy@gmail.com",10,0,"","").subscribe(
      (res)=>{
        this.devices = res.map(res=>{
          return {
            title:res.deviceName,
            value:res.id
          }
        })
       },
       (err)=>{

       })
  }
  next(){
    this.selectedDevices = this.form.value.devicesData.map((e)=>e.value);

  }
}

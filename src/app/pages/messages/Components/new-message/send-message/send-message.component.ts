import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  @ViewChild("dateTime") dateTime!: ElementRef;
  devices:SelectOption[];
  selectedDevices:string[]=[];
  devicesData = new FormControl([]);
  deviceId:string;
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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  devices:SelectOption[];
  deviceLoadingText:string='Loading ...';
  devicesData:any = new FormControl([]);
  deviceId:string="";
  message = new FormControl('');
  sessionTimeOut: any = new FormControl(15);

  form = new FormGroup({
    devicesData:this.devicesData,
    message:this.message,
    sessionTimeOut:this.sessionTimeOut
  });
  maxNum = 1000;
  minNum = 0;
  constructor(private devicesService:DevicesService,
    private authService:AuthService
    ) { }

  ngOnInit() {
    this.getDevices();
  }
  getDevices(){

    this.authService.getDevices(this.devicesService.email,10,0,"","").subscribe(
      (res)=>{
        let activeDevices=res.filter((r)=>r.isConnected)
        this.devices = activeDevices.map(res=>{
          return {
            title:res.deviceName,
            value:res.id,
            deviceIcon:res.deviceType
          }
        });
   
        if(activeDevices.length==0){
          this.deviceLoadingText='No Results'
        }
       },
       (err)=>{
        this.deviceLoadingText='No Results'

       })
  }
  onSelect(event){
    this.deviceId=event.value;

  }
}

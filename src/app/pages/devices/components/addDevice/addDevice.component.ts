import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DevicesService } from '../../devices.service';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';

@Component({
  selector: 'app-addDevice',
  templateUrl: './addDevice.component.html',
  styleUrls: ['./addDevice.component.scss']
})
export class AddDeviceComponent implements OnInit {
  isLoading = false;
  @Input() sessionName:string;
  @Input() token:string;
  @Input() port:number;
  @Input() serverId:number;
  @Output() isClose = new EventEmitter<boolean>;

  deviceName:any = new FormControl('',[Validators.required]);
  form = new FormGroup({
    deviceName:this.deviceName
  });
  constructor(    private toaster: ToasterServices,
    private devicesService:DevicesService) { }

  ngOnInit() {
  }
  submitAdd(){

    this.isLoading=true;
    let deviceN=this.form.value.deviceName;
    let phoneNumber="000";
    this.devicesService.addNewWhatsappBisunessDevice(this.devicesService.email,deviceN,phoneNumber,this.token,this.sessionName,this.port,this.serverId).subscribe(
      (res)=>{
        this.isLoading = false;
        this.isClose.emit(true);
        this.toaster.success("Device Added Successfully")
                  },
      (err)=>{
        this.isLoading = false;
        this.isClose.emit(false);
            }
    )
  }
}

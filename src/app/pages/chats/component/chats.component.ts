import { Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ChatContactsComponent } from '../components/chat-contacts/chat-contacts.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'] ,
})
export class ChatsComponent implements OnInit{
  constructor( public dialog: MatDialog,
    private translationService:TranslationService,
    private authService:AuthService
    ){
  }
  devices:any;
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,
  });
  deviceId:any
  ngOnInit() {
    this.getDevices()
  }
  getDevices(){

    this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","").subscribe(
      (res)=>{
        let alldevices=res;
  

        this.devices = alldevices.map(res=>{
          return {
            title:res.deviceName,
            value:res.id,
            deviceIcon:res.deviceType
          }
        });
        if(this.devices.length==0){ 
          this.deviceLoadingText='No Results'

        }
        else{
  
          this.deviceId=res[0].id;


        if(this.authService.selectedDeviceId ==""){
  
          this.form.patchValue({
          devicesData: {
          title:alldevices[0]?.deviceName,
          value:alldevices[0]?.id,
          deviceIcon:alldevices[0].deviceType
          }
  
          })
        }
        else{
          let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId)
          this.deviceId=this.authService.selectedDeviceId;
          this.form.patchValue({
            devicesData: {
            title:selected.title,
            value:selected?.value,
            deviceIcon:selected.deviceIcon
            }
  
            })
        }
  
      }},
       (err)=>{
        this.deviceLoadingText='No Results'

       })
  }
  
  addNewContact(){
    const currentLang=this.translationService.getCurrentLanguage()
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='450px';
    dialogConfig.minWidth='300px'
    dialogConfig.position =  currentLang=='ar'?{ right: '0'} :{ left: '0'} ;
    dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
    const dialogRef = this.dialog.open(ChatContactsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });
  }
  onSelect(device){
    this.deviceId=device.value;
    this.authService.selectedDeviceId=device.value
    }
}

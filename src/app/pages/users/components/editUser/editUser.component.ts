import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../users.service';
import { AddUserComponent } from '../addUser/addUser.component';
import { DevicesData, DeviceSections, Users } from '../../users';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editUser',
  templateUrl: './editUser.component.html',
  styleUrls: ['./editUser.component.scss']
})
export class EditUserComponent implements OnInit {
  isLoading

  userPermisions:DevicesData[];
  userPermisions$:{name:string,value:string}[]=[]

  sharedPermisions:DeviceSections[];
  sharedPermisions$:{name:string,value:string}[]=[]
  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
    private translate: TranslateService,

              private userService:UsersService,
              @Inject(MAT_DIALOG_DATA) public data:any,
              private toaster: ToasterServices) { }

  ngOnInit() {

  }
  addPermissions(event){
    this.userPermisions=event;

  }
  addSharedPermisions(event){
      this.sharedPermisions=event;
  }

  preparePermisions(){

    this.userPermisions$=[];
    if(this.userPermisions){

      this.userPermisions.map((permission)=>{
        let sectionName;
        let deviceId=permission.deviceId;
        let accessValue;

        permission.sectionsLevels.map((level)=>{
          sectionName=level.section.label
          accessValue=level.accessLevels.find((l)=>l.checked).value;
         this.userPermisions$.push(this.createAccessLevels(sectionName,accessValue,deviceId)) ;

        })})
        ;
    }
    this.sharedPermisions$=[];
    this.sharedPermisions.map((permision)=>{
      let sectionName = permision.section.label;
      let accesValue = permision.accessLevels.find((l)=>l.checked).value;
      this.sharedPermisions$.push(this.createAccessLevels(sectionName,accesValue))
    });
    return [...this.userPermisions$,...this.sharedPermisions$]
  }
  createAccessLevels(name:string,value:string,deviceId?:string){
    if(deviceId){
      return {
        name:`${name}_${deviceId}`,
        value:value
      }
    }
    else{
      return {
        name:name,
        value:value
      }
    }

  }
  submitEdit(){
    let email =this.data.email;
    let customerId=this.userService.id;
    let allPermisions=this.preparePermisions();
    const data={

      email: email,
      customerId: customerId,
      permissions:allPermisions
    }
    this.isLoading = true;

    this.userService.editUserPermissions(data).subscribe(
      (res) => {
        this.isLoading = false;
        this.onClose(true);
                this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

      },
      (err) => {
        this.isLoading = false;
        this.onClose(false);
      }
    )
  }

  onClose(data?): void {
    this.dialogRef.close(data);
}
}

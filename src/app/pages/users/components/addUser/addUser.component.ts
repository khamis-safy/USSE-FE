import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DeviceSections, DevicesData } from '../../users';
export interface TestData{
  deviceId:string,
  deviceValue:string
}
export interface AccessLevels{
  value:string,
  checked:boolean
  // state:string
}

@Component({

    selector: 'app-addUser',
    templateUrl: './addUser.component.html',
    styleUrls: ['./addUser.component.scss'],
   // standalone: true,
    //imports: [MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule ,MatSelectModule]

})
export class AddUserComponent {

  userPermisions:DevicesData[];
  userPermisions$:{name:string,value:string}[]=[]

  sharedPermisions:DeviceSections[];
  sharedPermisions$:{name:string,value:string}[]=[]

    constructor(public dialogRef: MatDialogRef<AddUserComponent>) {
    }

    submitAdd() {
      let allPermisions=this.preparePermisions();
      console.log("all permisions",allPermisions)
        // this.onClose()
    }


    onClose(data?): void {
        this.dialogRef.close(data);
    }


    addPermissions(event){
      this.userPermisions=event;

    }
    addSharedPermisions(event){
        this.sharedPermisions=event;
    }

    preparePermisions(){
      this.userPermisions$=[];
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

}

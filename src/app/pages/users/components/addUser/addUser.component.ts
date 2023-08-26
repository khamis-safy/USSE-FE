import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectOption } from 'src/app/shared/components/select/select-option.model';
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
    listsArr:SelectOption[];
    select=false
    next=false;
    devices:SelectOption[];
    testData:TestData[]=[
      {
        deviceId:"lskjdlfkjsdfii443232",
        deviceValue:"device1"
      },
      {
        deviceId:"lklijefksnfngdglks",
        deviceValue:"device2"
      },
      {
        deviceId:"llkjnidflskdjfiee",
        deviceValue:"device3"
      }

    ]
    devicesData = new FormControl([]);
    form = new FormGroup({
      devicesData:this.devicesData,

    });
    selectedDevices:string[]=[];
    // accessLevels :AccessLevels[]= [
    //   {
    //     value:"readOnly",
    //     state:"checked"
    //   },
    //   {
    //     value:"fullAccess",
    //     state:""
    //   },
    //   {
    //     value:"none",
    //     state:""
    //   }
    // ]
    accessLevels :AccessLevels[]= [
      {
        value:"readOnly",
        checked:true
      },
      {
        value:"fullAccess",
        checked:false
      },
      {
        value:"none",
        checked:false
      }
    ]
    sections = [
      { icon: 'assets/icons/me-icon.svg', label: 'Messages', name: 'messages',accessLevels:this.accessLevels },
      { icon: 'assets/icons/users-compagns-icon.svg', label: 'Campaigns', name: 'campaigns',accessLevels:this.accessLevels },
      { icon: 'assets/icons/users-temp.svg', label: 'Templates', name: 'templates' ,accessLevels:this.accessLevels},
      { icon: 'assets/icons/users-bots.svg', label: 'Bots', name: 'bots',accessLevels:this.accessLevels },
      { icon: 'assets/icons/users-devices.svg', label: 'Devices', name: 'devices',accessLevels:this.accessLevels },
      { icon: 'assets/icons/users-contacts.svg', label: 'Contacts', name: 'contacts',accessLevels:this.accessLevels }
    ];

    constructor(public dialogRef: MatDialogRef<AddUserComponent>) {
      this.devices = this.testData.map(res=>{
        return {
          title:res.deviceValue,
          value:res.deviceId
        }
      });
     }
     onSelect(event){
      this.accessLevels.map((level)=>{if(level.value=="readOnly"){
        // level.state="checked";
        level.checked=true
      }})

    }
     test(e){
      console.log(e)
    }

    submitSave() {
        console.log('edit work');
        this.onClose()
    }


    onClose(data?): void {
        this.dialogRef.close(data);
    }

    openNext(){
        this.next=true;
    }
    openPrevious(){
        this.next=false;
    }







}

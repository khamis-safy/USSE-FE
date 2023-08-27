import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectOption } from 'src/app/shared/components/select/select-option.model';


interface DevicePermisions{
  deviceId:string;
  permisions:{key:string, name: string, value: string }[],
  sections:Section[]
}

interface Section{
    icon: string,
    label: string,
    name: string,

  }

export interface TestData{
  deviceId:string,
  deviceValue:string
}
export interface AccessLevels{
  value:string,
  checked:boolean
  // state:string
}
interface DeviceSections{
  section:Section,
  accessLevels:AccessLevels[],

}
interface DevicesData{
  deviceId:string,
  sectionsLevels:DeviceSections[];
}
@Component({

    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss'],
   // standalone: true,
    //imports: [MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule ,MatSelectModule]

})
export class ActionComponent implements OnInit{
  // devicesPermisions:DevicePermisions[]=[];
  @Output() permissions=new EventEmitter<DevicesData[]>
  devices:SelectOption[];
  testData:TestData[];
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,

  });
  selectedDevice!:DevicesData;
  allDevices:DevicesData[];
updated:any
  // sections = [
  //   { icon: 'assets/icons/me-icon.svg', label: 'Messages', name: 'messages' , accessLevels : [
  //   {
  //     value:"readOnly",
  //     checked:true
  //   },
  //   {
  //     value:"fullAccess",
  //     checked:false
  //   },
  //   {
  //     value:"none",
  //     checked:false
  //   }
  // ]},
  //   { icon: 'assets/icons/users-compagns-icon.svg', label: 'Campaigns', name: 'campaigns' , accessLevels : [
  //   {
  //     value:"readOnly",
  //     checked:true
  //   },
  //   {
  //     value:"fullAccess",
  //     checked:false
  //   },
  //   {
  //     value:"none",
  //     checked:false
  //   }
  // ]},
  //   { icon: 'assets/icons/users-temp.svg', label: 'Templates', name: 'templates', accessLevels : [
  //   {
  //     value:"readOnly",
  //     checked:true
  //   },
  //   {
  //     value:"fullAccess",
  //     checked:false
  //   },
  //   {
  //     value:"none",
  //     checked:false
  //   }
  // ]},
  //   { icon: 'assets/icons/users-bots.svg', label: 'Bots', name: 'bots', accessLevels : [
  //   {
  //     value:"readOnly",
  //     checked:true
  //   },
  //   {
  //     value:"fullAccess",
  //     checked:false
  //   },
  //   {
  //     value:"none",
  //     checked:false
  //   }
  // ]},
  //   { icon: 'assets/icons/users-devices.svg', label: 'Devices', name: 'devices' , accessLevels : [
  //   {
  //     value:"readOnly",
  //     checked:true
  //   },
  //   {
  //     value:"fullAccess",
  //     checked:false
  //   },
  //   {
  //     value:"none",
  //     checked:false
  //   }
  // ]},
  //   { icon: 'assets/icons/users-contacts.svg', label: 'Contacts', name: 'contacts', accessLevels : [
  //   {
  //     value:"readOnly",
  //     checked:true
  //   },
  //   {
  //     value:"fullAccess",
  //     checked:false
  //   },
  //   {
  //     value:"none",
  //     checked:false
  //   }
  // ]}
  // ];
  sections = [
    { icon: 'assets/icons/me-icon.svg', label: 'Messages', name: 'messages' },
    { icon: 'assets/icons/users-compagns-icon.svg', label: 'Campaigns', name: 'campaigns' },
    { icon: 'assets/icons/users-temp.svg', label: 'Templates', name: 'templates'},
    { icon: 'assets/icons/users-bots.svg', label: 'Bots', name: 'bots'},
    { icon: 'assets/icons/users-devices.svg', label: 'Devices', name: 'devices' },
    { icon: 'assets/icons/users-contacts.svg', label: 'Contacts', name: 'contacts'}
  ];
    constructor(public dialogRef: MatDialogRef<ActionComponent>) {

     }
  ngOnInit() {
    this.getDevices();

   this.form.patchValue({
    devicesData:this.devices[0]
   })

  }
setDefaultSections(device){
let sectionsLevels=this.sections.map((sec)=>{
  return{
    section:sec,
    accessLevels: [
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

  }
})
return sectionsLevels
}

getDevices(){
 this.testData=[
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
  this.devices = this.testData.map(res=>{
    return {
      title:res.deviceValue,
      value:res.deviceId
    }
  });

this.allDevices=this.testData.map((device)=>{
  return{
    deviceId:device.deviceId,
    sectionsLevels:this.setDefaultSections(device)
  }
});
this.permissions.emit(this.allDevices)
this.selectedDevice=this.allDevices[0];
// this.devicesPermisions= this.testData.map((device)=>{
//   let sectionName=this.createSetions().map((e)=>e.label);
//   let permisions=sectionName.map((section)=>{
//     return this.createAccessLevels(device.deviceId,section);
//   })
//   return{
//     deviceId:device.deviceId,
//     permisions:permisions,
//     sections:this.sections
//   }
// })
// this.selectedDevice=this.devicesPermisions[0]
// console.log(this.devicesPermisions)
}

  createAccessLevels(deviceId:string,name:string){
    return {
      key:name,
      name:`${name}_${deviceId}`,
      value:'readOnly'
    }
  }
  // createSetions(){
  //   return[
  //     { icon: 'assets/icons/me-icon.svg', label: 'Messages', name: 'messages' , accessLevels : [
  //     {
  //       value:"readOnly",
  //       checked:true
  //     },
  //     {
  //       value:"fullAccess",
  //       checked:false
  //     },
  //     {
  //       value:"none",
  //       checked:false
  //     }
  //   ]},
  //     { icon: 'assets/icons/users-compagns-icon.svg', label: 'Campaigns', name: 'campaigns' , accessLevels : [
  //     {
  //       value:"readOnly",
  //       checked:true
  //     },
  //     {
  //       value:"fullAccess",
  //       checked:false
  //     },
  //     {
  //       value:"none",
  //       checked:false
  //     }
  //   ]},
  //     { icon: 'assets/icons/users-temp.svg', label: 'Templates', name: 'templates', accessLevels : [
  //     {
  //       value:"readOnly",
  //       checked:true
  //     },
  //     {
  //       value:"fullAccess",
  //       checked:false
  //     },
  //     {
  //       value:"none",
  //       checked:false
  //     }
  //   ]},
  //     { icon: 'assets/icons/users-bots.svg', label: 'Bots', name: 'bots', accessLevels : [
  //     {
  //       value:"readOnly",
  //       checked:true
  //     },
  //     {
  //       value:"fullAccess",
  //       checked:false
  //     },
  //     {
  //       value:"none",
  //       checked:false
  //     }
  //   ]},
  //     { icon: 'assets/icons/users-devices.svg', label: 'Devices', name: 'devices' , accessLevels : [
  //     {
  //       value:"readOnly",
  //       checked:true
  //     },
  //     {
  //       value:"fullAccess",
  //       checked:false
  //     },
  //     {
  //       value:"none",
  //       checked:false
  //     }
  //   ]},
  //     { icon: 'assets/icons/users-contacts.svg', label: 'Contacts', name: 'contacts', accessLevels : [
  //     {
  //       value:"readOnly",
  //       checked:true
  //     },
  //     {
  //       value:"fullAccess",
  //       checked:false
  //     },
  //     {
  //       value:"none",
  //       checked:false
  //     }
  //   ]}
  //   ]
  // }

     onSelect(event){
      let prevDevice =this.selectedDevice;
      this.selectedDevice=this.allDevices.find((device)=>device.deviceId==event.value);
      this.permissions.emit(this.allDevices)

      // let prevDevice=this.selectedDevice;
      // console.log("before default",prevDevice);
      // this.selectedDevice=this.devicesPermisions.find((dev)=>dev.deviceId==event.value)

      //   this.defualtData(this.selectedDevice);

      // console.log(prevDevice)


      // this.accessLevels.map((level)=>{if(level.value=="readOnly"){
      //   level.checked=true
      // }})
// this.updated.push(this.selectedDevice);
//       this.selectedDevice=this.devicesPermisions.find((e)=>e.deviceId==event.value);
//       this.selectedDevice.sections.map((e)=>)

      // console.log("prev",prevDevice);
      // console.log("selected ",this.selectedDevice)
      console.log("all devices data",this.allDevices)
    }
//      test(e){
//       console.log(e)
//     }
// defualtData(device:DevicePermisions){
//   device.sections.map((e)=>e.accessLevels.map((level)=>level.checked=(level.value=="readOnly")));
//   console.log("after",device)

// }
onAccessLevelChange(section: any, changedAccessLevel: any) {
section.accessLevels.forEach((accessLevel: any) => {
  accessLevel.checked = accessLevel === changedAccessLevel;
});

this.permissions.emit(this.allDevices)

}


}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AccessLevels, DeviceSections, DevicesData, Users } from '../../users';
import { DevicesService } from 'src/app/pages/devices/devices.service';


// interface DevicePermisions{
//   deviceId:string;
//   permisions:{key:string, name: string, value: string }[],
//   sections:Section[]
// }

// export interface Section{
//     icon: string,
//     label: string,
//     name: string,

//   }

export interface TestData{
  deviceId:string,
  deviceValue:string
}
// export interface AccessLevels{
//   value:string,
//   checked:boolean
//   // state:string
// }
// export interface DeviceSections{
//   section:Section,
//   accessLevels:AccessLevels[],


// }
// export interface DevicesData{
//   deviceId:string,
//   sectionsLevels:DeviceSections[];
// }
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
  @Output() sharedPermissions=new EventEmitter<DeviceSections[]>
  @Input() data:Users;
  deviceLoadingText:string='Loading ...';

  devices:SelectOption[];
  testData:TestData[];
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,

  });
  selectedDevice!:DevicesData;
  allDevices:DevicesData[];
updated:any;
noDevices;
permissionsData;
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

  ];
  sharedSections=[
    { icon: 'assets/icons/users-temp.svg', label: 'Templates', name: 'templates'},
    { icon: 'assets/icons/users-bots.svg', label: 'Bots', name: 'bots'},
    { icon: 'assets/icons/users-devices.svg', label: 'Devices', name: 'devices' },
    { icon: 'assets/icons/users-contacts.svg', label: 'Contacts', name: 'contacts'}
  ]
  sharedPermisions;
  isEdit: boolean;
    constructor(private devicesService:DevicesService,public dialogRef: MatDialogRef<ActionComponent>) {

     }
  ngOnInit() {
    if(this.data){

      this.isEdit = true;
      this.permissionsData=this.data.permissions;

    }else{
      this.isEdit = false;


    }
          this.sharedPermisions=this.isEdit?this.fillingSharedPermissions(this.data.permissions): this.setSharedSections();

      // this.sharedPermisions= this.setSharedSections();
      this.sharedPermissions.emit(this.sharedPermisions)

    this.getDevices();



  }
fillengDevicesPermissions(permission:any){
  let devicesPermissions=permission.filter((permissoin)=>permissoin.name.split("_").length>=2);
  let devicesP=devicesPermissions.map((devPer)=>{
    let sectionName=devPer.name;
    let section =this.sections.find((sec)=>sec.label==sectionName)
    let accessLevel=devPer.value;

    return{
      section:section,
      accessLevels: [
        {
          value: "ReadOnly",
          checked: accessLevel === "ReadOnly"
        },
        {
          value: "FullAccess",
          checked: accessLevel === "FullAccess"
        },
        {
          value: "None",
          checked: accessLevel === "None"
        }
      ]


    }
  })
return devicesP;
}
fillingSharedPermissions(permission:any){
  let sharedPermissions=permission.filter((permissoin)=>permissoin.name.split("_").length<2);
 let shared= sharedPermissions.map((shared)=>{
    let sectionName=shared.name.split("_")[0];

    let accessLevel=shared.value;
    let section =this.sharedSections.find((sec)=>sec.label==sectionName)

    return{
      section:section,
      accessLevels: [
        {
          value: "ReadOnly",
          checked: accessLevel === "ReadOnly"
        },
        {
          value: "FullAccess",
          checked: accessLevel === "FullAccess"
        },
        {
          value: "None",
          checked: accessLevel === "None"
        }
      ]
    }

  })
  return shared
}

  setSharedSections(){
  let sharedPermisions= this.sharedSections.map((section)=>{
    return{
      section:section,
      accessLevels: [
        {
          value:"ReadOnly",
          checked:true
        },
        {
          value:"FullAccess",
          checked:false
        },
        {
          value:"None",
          checked:false
        }
      ]

    }
   })
   return sharedPermisions;
  }
setDeviceSections(){

let sectionsLevels=this.sections.filter((sec)=>sec.label=='Messages' || sec.label== 'Campaigns').map((sec)=>{


    return{
      section:sec,
      accessLevels: [
        {
          value:"ReadOnly",
          checked:true
        },
        {
          value:"FullAccess",
          checked:false
        },
        {
          value:"None",
          checked:false
        }
      ]

    }


})
return sectionsLevels
}

getDevices(){
  this.devicesService.getDevices(this.devicesService.email,10,0,"","").subscribe(
    (res)=>{
      console.log(res)
    let devicesData=res;
      this.devices = res.map(res=>{
        return {
          title:res.deviceName,
          value:res.id
        }
      });
      console.log(this.devices)
      if(this.devices.length==0){
        this.noDevices=true;
        this.deviceLoadingText='No Results'
      }
      else{
        this.noDevices=false;
          this.form.patchValue({
            devicesData: {
              title:devicesData[0]?.deviceName,
              value:devicesData[0]?.id
            }

   })
    this.allDevices=res.map((device)=>{

      return{
        deviceId:device.id,
        sectionsLevels:this.isEdit?this.fillengDevicesPermissions(this.data.permissions): this.setDeviceSections(),
      }
    });


    this.permissions.emit(this.allDevices);
    this.selectedDevice=this.allDevices[0];
      }
     },
     (err)=>{
      this.deviceLoadingText='No Results'

     })
//  this.testData=[
//     {
//       deviceId:"lskjdlfkjsdfii443232",
//       deviceValue:"device1"
//     },
//     {
//       deviceId:"lklijefksnfngdglks",
//       deviceValue:"device2"
//     },
//     {
//       deviceId:"llkjnidflskdjfiee",
//       deviceValue:"device3"
//     }

//   ]
//   this.devices = this.testData.map(res=>{
//     return {
//       title:res.deviceValue,
//       value:res.deviceId
//     }
//   });

// this.allDevices=this.testData.map((device)=>{

//   return{
//     deviceId:device.deviceId,
//     sectionsLevels:this.setDeviceSections(),
//   }
// });


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
if(this.allDevices){

  this.permissions.emit(this.allDevices);
}
this.sharedPermissions.emit(this.sharedPermisions)


}


}

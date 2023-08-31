import { Component, Inject, OnInit } from '@angular/core';
import { Contacts } from '../../../contacts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../../manage-contacts.service';
import { DeleteListComponent } from '../../lists/delete-list/delete-list.component';
import { DevicesService } from 'src/app/pages/devices/devices.service';
interface CheckedCont{
 contactsData:
  { contacts?:Contacts[],
    remove?:boolean
  },
  device?:{deviceId:string}

}
@Component({
  selector: 'app-deleteContact',
  templateUrl: './deleteContact.component.html',
  styleUrls: ['./deleteContact.component.scss']
})
export class DeleteContactComponent implements OnInit {
  isLoading = false;
  numOfItems:number=0;
  isRemoveL:boolean;
  body:string[];
  isContacts:boolean=false;
  isDevices:boolean=false;
  constructor(
    private devicesService:DevicesService,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<DeleteContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CheckedCont,
  ) {
    this.body = this.data.contactsData?.contacts?.map(res=>res.id);
   }

  ngOnInit() {
    if(this.data.contactsData){
      this.isContacts=true;
      this.isDevices=false;
      let body = this.data.contactsData.contacts.map(res=>res.id)
      this.numOfItems=body.length;

    if(this.data.contactsData.remove){
      this.isRemoveL=true;
    }
    else{
      this.isRemoveL=false;

    }}
    else{
      this.isContacts=false;
      this.isDevices=true;

    }


  }

  deleteCon(){

    this.listService.deleteContact(this.listService.email,this.body).subscribe(
      (res)=>{
        this.isLoading = false

        this.onClose(this.body);
        let succ=res.numberOfSuccess;
        let err =res.numberOfErrors;
        if(succ==0 && err>0){
          this.toaster.error(`Error - ${err}`)
        }

        else if(succ>0 && err >0){
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if(succ>0 && err ==0){
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

        }

      },
      (err)=>{
        this.isLoading = false
        this.onClose();
        this.toaster.error("Error")

      }
    )
  }
  removeLists(){
    this.listService.removeContactsFromLists(this.body,this.listService.email).subscribe(
      (res)=>{
        this.isLoading = false
        this.onClose(this.body);

        let succ=res.numberOfSuccess;
        let err =res.numberOfErrors;
        if(succ==0 && err>0){
          this.toaster.error(`Error - ${err}`)
        }

        else if(succ>0 && err >0){
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if(succ>0 && err ==0){
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

        }

      },
      (err)=>{
        this.isLoading = false
        this.onClose();
        this.toaster.error("Error")

      }
    )

  }

  deleteDevice(){
this.devicesService.deleteDevice(this.devicesService.email,this.data.device.deviceId).subscribe(
  (res)=>{
    this.isLoading = false

    this.onClose(true);

    this.toaster.success(`Deleted Successfully`)


  },
  (err)=>{
    this.isLoading = false
    this.onClose();
    this.toaster.error("Error")

  }
)

  }
  submit(){
    this.isLoading = true;
    if(this.isContacts){
      if(this.isRemoveL){
        this.removeLists();
      }
      else{
        this.deleteCon();

      }

    }
    if(this.isDevices){

      this.deleteDevice();
    }


  }
   onClose(data?): void {
    this.dialogRef.close(data);


  }

}

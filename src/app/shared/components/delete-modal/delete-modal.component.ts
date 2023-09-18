import { Component, Inject, OnInit } from '@angular/core';
import { UsButtonComponent } from '../us-button/us-button.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { TemplatesService } from 'src/app/pages/templates/templates.service';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { ToasterServices } from '../us-toaster/us-toaster.component';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { Message } from 'src/app/pages/messages/message';
import { MessagesService } from 'src/app/pages/messages/messages.service';
import { compaignDetails } from 'src/app/pages/compaigns/campaigns';
import { CompaignsService } from 'src/app/pages/compaigns/compaigns.service';

interface ComponentData {
  contactsData?: { contacts: Contacts[], remove: boolean },
  deviceData?: { deviceId: string },
  templatesData?: { templatesId: string },
  listsData?: { contacts: Contacts[], list: string[], lists: ListData[] },
  messagesData?: { messages: Message[] },
  compaignData?: { compaignId: string, action: string },

}
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  contacts: string[];
  list: string[];
  action;

  isLoading = false;
  numOfItems: number = 0;
  isRemoveL: boolean;
  body: string[];
  removeCon: boolean = false;

  isContacts: boolean = false;
  isDevices: boolean = false;
  isTemplates: boolean = false;
  isLists: boolean = false;
  isMessages: boolean = false;
  isCompaigns: boolean = false;
  constructor(
    private devicesService: DevicesService,
    private templatesService: TemplatesService,
    private listService: ManageContactsService,
    private messageService: MessagesService,
    private toaster: ToasterServices,
    private compaignsService: CompaignsService,
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComponentData,
  ) {
  }

  ngOnInit() {

    if (this.data.contactsData) {
      this.isContacts = true;
      this.isDevices = false;
      this.isTemplates = false;
      this.isLists = false;
      this.isMessages = false
      this.body = this.data.contactsData.contacts.map(res => res.id)
      this.numOfItems = this.body.length;




      if (this.data.contactsData.remove) {
        this.isRemoveL = true;
      }
      else {
        this.isRemoveL = false;

      }
    }
    else if (this.data.listsData) {

      if (this.data.listsData.list) {
        this.removeCon = true;
        this.contacts = this.data.listsData.contacts.map((e) => e.id);
        this.list = this.data.listsData.list;
        this.body = this.contacts
        this.numOfItems = this.body.length;
      }
      else {
        this.removeCon = false;
        this.body = this.data.listsData.lists.map(res => res.id);
        this.numOfItems = this.body.length;
      }



      this.isContacts = false;
      this.isDevices = false;
      this.isTemplates = false;
      this.isLists = true;
      this.isMessages = false;

    }
    else if (this.data.messagesData) {
      this.isContacts = false;
      this.isDevices = false;
      this.isTemplates = false;
      this.isLists = false;
      this.isMessages = true;


      this.body = this.data.messagesData.messages.map(res => res.id);
      this.numOfItems = this.body.length;
    }


    else if (this.data.templatesData) {
      this.isContacts = false;
      this.isDevices = false;
      this.isTemplates = true;
      this.isLists = false;
      this.isMessages = false;

    }
    else if (this.data.compaignData) {
      this.action = this.data.compaignData.action;
      this.isContacts = false;
      this.isDevices = false;
      this.isLists = false;
      this.isMessages = false;
      this.isCompaigns = true;
      console.log("is compaigns", this.isCompaigns)

    }
    else {
      this.isContacts = false;
      this.isDevices = true;
      this.isTemplates = false;
      this.isLists = false;
      this.isMessages = false;
      this.isCompaigns = false;

    }


  }

  deleteCon() {

    this.listService.deleteContact(this.listService.email, this.body).subscribe(
      (res) => {
        this.isLoading = false

        this.onClose(this.body);
        let succ = res.numberOfSuccess;
        let err = res.numberOfErrors;
        if (succ == 0 && err > 0) {
          this.toaster.error(`Error - ${err}`)
        }

        else if (succ > 0 && err > 0) {
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if (succ > 0 && err == 0) {
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

        }

      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )
  }

  removeLists() {
    this.listService.removeContactsFromLists(this.body,this.listService.email).subscribe(
      (res) => {
        this.isLoading = false
        this.onClose(this.body);

        let succ = res.numberOfSuccess;
        let err = res.numberOfErrors;
        if (succ == 0 && err > 0) {
          this.toaster.error(`Error - ${err}`)
        }

        else if (succ > 0 && err > 0) {
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if (succ > 0 && err == 0) {
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

        }

      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )

  }


  deleteDevice() {
    this.devicesService.deleteDevice(this.devicesService.email, this.data.deviceData.deviceId).subscribe(
      (res) => {
        this.isLoading = false

        this.onClose(true);

        this.toaster.success(`Deleted Successfully`)


      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )

  }


  deleteCompaign() {
    this.compaignsService.deleteWhatsappBusinessCampaign(this.data.compaignData.compaignId, this.compaignsService.email).subscribe(
      (res) => {
        this.isLoading = false


        this.onClose(true);

        this.toaster.success(`Deleted Successfully`)



      },
      (err) => {
        this.isLoading = false
        this.onClose();


      }
    )


  }
  stopComaign() {
    this.compaignsService.stopWhatsappBusinessCampaign(this.data.compaignData.compaignId, this.compaignsService.email).subscribe(
      (res) => {
        this.isLoading = false

        this.onClose(true);

        this.toaster.success(`Deleted Successfully`)


      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )

  }




  deleteTemplates() {
    this.templatesService.deleteTemplates(this.templatesService.email, this.data.templatesData.templatesId).subscribe(
      (res) => {
        this.isLoading = false

        this.onClose(true);

        this.toaster.success(`Deleted Successfully`)


      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )

  }



  deleteList() {
    this.isLoading = true
    let body = this.data.listsData.lists.map(res => res.id)
    this.listService.deleteList(this.listService.email, body).subscribe(
      (res) => {
        this.isLoading = false
        this.onClose(body);
        let succ = res.numberOfSuccess;
        let err = res.numberOfErrors;
        if (succ == 0 && err > 0) {
          this.toaster.error(`Error - ${err}`)
        }

        else if (succ > 0 && err > 0) {
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if (succ > 0 && err == 0) {
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

        }

      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )
  }
  removeContacts() {
    this.listService.removeContactsFromOneList(this.contacts, this.list,this.listService.email).subscribe(
      (res) => {
        this.isLoading = false
        this.onClose(true);
        let succ = res.numberOfSuccess;
        let err = res.numberOfErrors;
        if (succ == 0 && err > 0) {
          this.toaster.error(`Error - ${err}`)
        }

        else if (succ > 0 && err > 0) {
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if (succ > 0 && err == 0) {
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

        }

      },
      (err) => {
        this.isLoading = false
        this.onClose();

      }
    )
  }
  deleteMessages() {
    this.messageService.deleteMessage(this.body).subscribe(
      (res) => {
        this.isLoading = false
        this.onClose(this.body);
        let succ = res.numberOfSuccess;
        let err = res.numberOfErrors;
        if (succ == 0 && err > 0) {
          this.toaster.error(`Error - ${err}`)
        }

        else if (succ > 0 && err > 0) {
          this.toaster.warning(`${succ} Success ${err} Failed`)
        }
        else if (succ > 0 && err == 0) {
          this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)


        }
      })
  }





submit() {
  this.isLoading = true;
  if (this.isContacts) {
    if (this.isRemoveL) {
      // remove lists from contacts
      this.removeLists();
    }
    else {
      this.deleteCon();

    }

  }
  else if (this.isLists) {
    if (this.data.listsData.list) {
      // from list details, remove contacts from list
      this.removeContacts();
    }
    else {
      this.deleteList()
    }
  }

  else if (this.isMessages) {
    this.deleteMessages();

  } else if (this.isTemplates) {
    this.deleteTemplates();
  }
  else if (this.isCompaigns) {
    if (this.data.compaignData.action == "delete") {

      this.deleteCompaign()
    }
    else {
      this.stopComaign()
    }}



    else {
      this.deleteDevice();
    }

  }


  onClose(data ?): void {
    this.dialogRef.close(data);
  }

}

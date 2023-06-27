import { DeleteListComponent } from './../components/lists/delete-list/delete-list.component';
import { ToasterServices } from './../../../shared/components/us-toaster/us-toaster.component';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddListComponent } from '../components/lists/addList/addList.component';
import { ListsComponent } from '../components/lists/lists.component';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { ManageContactsService } from '../manage-contacts.service';
import { AddContactComponent } from '../components/contacts/addContact/addContact.component';
import { DeleteContactComponent } from '../components/contacts/deleteContact/deleteContact.component';

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.scss'],

})
export class ManageContactsComponent {
  tabs=["contacts","lists","unsubscribe"];
  tab = this.tabs[0];
  added:boolean=false;
  isDelete;
  @ViewChild(ListsComponent) lists:ListsComponent;
  @ViewChild(ContactsComponent) contacts:ContactsComponent;

  constructor(public dialog: MatDialog,private  toaster: ToasterServices,private listService:ManageContactsService){

  }
  test(){
    this.toaster.warning('hello')
  }
  openAddListModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='85vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    const dialogRef = this.dialog.open(AddListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.lists.getListsCount();
      this.lists.getListData();
    });
    console.log("add-list-modal")

  }
  openAddContactModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='70vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.contactsCount();
        this.contacts.getContacts();

      }
    });
    console.log("add-contactt-modal")
  }
  onDeleteChange(e){
    this.isDelete = e;
    console.log("onDeleteChange",e)
  }
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data = this.isDelete;
    const dialogRef = this.dialog.open(DeleteListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.lists.getListsCount();
      this.lists.getListData();
      this.lists.selection.clear();
      console.log("delete afterClosed",this.lists.selection)

    });
  }
  openDeleteConModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data = this.isDelete;
    const dialogRef = this.dialog.open(DeleteContactComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.contacts.contactsCount();
      this.contacts.getContacts();
      this.contacts.selection.clear();
      console.log("delete afterClosed",this.lists.selection)

    });
    console.log("delete contact")
  }
  openunsubscribeModal(){
    console.log("add-unsubscribe-modal")
  }

  changeModal(ev){
    this.listService.display=5;
    this.listService.pageNum=0;
    this.listService.email="khamis.safy@gmail.com";
    this.listService.orderedBy='';
    this.listService.search='';

    this.tab=this.tabs[ev.index]
    if(this.tab=='contacts'){
      this.contacts.getContacts();
    }
    else if(this.tab=='lists'){
      this.lists.getListData();
    }
    else{
      console.log("unsub")
    }
    console.log("tab name: ",this.tab)
  }
}

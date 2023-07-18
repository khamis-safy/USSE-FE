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
import { ContactListsComponent } from '../components/contacts/contactLists/contactLists.component';

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
  isChecked;
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
      if(result){
        this.lists.getListData();
      }

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
        this.contacts.getContacts();
      }
    });
    console.log("add-contactt-modal")
  }
  onDeleteChange(e){
    this.isDelete = e;
    console.log("onDeleteChange",e)
  }
  onChecked(e){
    this.isChecked=e;

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
      if(result){
        this.lists.deletedLists=result;
        this.lists.openSnackBar();
        this.lists.getListData();
      }
      this.lists.selection.clear();
      this.lists.checks._results=[]
      console.log("delete afterClosed",this.lists.selection)

    });
  }
  openDeleteConModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =  {contacts:this.isChecked,remove:false};
    const dialogRef = this.dialog.open(DeleteContactComponent,dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.deletedContacts=result;
        this.contacts.openSnackBar();
        this.contacts.getContacts();

      }
      this.contacts.checks._results=[]

      this.contacts.selection.clear();

    });
    console.log("delete contact")
  }


  removeLists(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data = {contacts:this.isChecked,remove:true};
    const dialogRef = this.dialog.open(DeleteContactComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.getContacts();
      }
      this.contacts.checks._results=[]

      this.contacts.selection.clear();

    });
  }
  openContactLists(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='70vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.data = this.isChecked;
    const dialogRef = this.dialog.open(ContactListsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.getContacts();

      }
      this.contacts.selection.clear();
      this.contacts.checks._results=[]
      console.log("delete afterClosed",this.lists.selection)

    });

  }

  openunsubscribeModal(){
    console.log("add-unsubscribe-modal")
  }

  changeModal(ev){
    this.listService.display=10;
    this.listService.pageNum=0;
    this.listService.email="khamis.safy@gmail.com";
    this.listService.orderedBy='';
    this.listService.search='';
    this.contacts.selection.clear();
    this.lists.selection.clear();


    this.tab=this.tabs[ev.index]
    if(this.tab=='contacts'){
      this.contacts.getContacts();
      this.lists.destroy();
      this.lists.paginator.pageSize=this.listService.display;
      this.lists.paginator.pageIndex=this.listService.pageNum;
    }
    else if(this.tab=='lists'){
      this.lists.getListData();
      this.contacts.destroy();
      this.contacts.paginator.pageSize=this.listService.display;
      this.contacts.paginator.pageIndex=this.listService.pageNum;

    }
    else{
      console.log("unsub")
    }
    console.log("tab name: ",this.tab)
  }
}

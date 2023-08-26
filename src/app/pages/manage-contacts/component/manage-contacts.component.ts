import { DeleteListComponent } from './../components/lists/delete-list/delete-list.component';
import { ToasterServices } from './../../../shared/components/us-toaster/us-toaster.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddListComponent } from '../components/lists/addList/addList.component';
import { ListsComponent } from '../components/lists/lists.component';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { ManageContactsService } from '../manage-contacts.service';
import { AddContactComponent } from '../components/contacts/addContact/addContact.component';
import { DeleteContactComponent } from '../components/contacts/deleteContact/deleteContact.component';
import { ContactListsComponent } from '../components/contacts/contactLists/contactLists.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.scss'],

})
export class ManageContactsComponent implements AfterViewInit{
  tabs=["contacts","lists","cancel"];
  tab = this.tabs[0];
  added:boolean=false;
  isDelete;
  isChecked;
  @ViewChild(ListsComponent) lists:ListsComponent;
  @ViewChild(ContactsComponent) contacts:ContactsComponent;
  isCanceled:boolean;

  constructor(public dialog: MatDialog,private  toaster: ToasterServices,private listService:ManageContactsService){

  }
  ngAfterViewInit(){
    this.isCanceled=false;
  }


  openAddListModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='85vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AddListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.lists.getListData();
      }

    });

  }
  openAddContactModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='70vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.getContacts();
      }
    });
  }

  
  onDeleteChange(e){
    this.isDelete = e;
  }
  onChecked(e){
    this.isChecked=e;

  }
  // deleteCanceled(e){
  //   this.isCanceled=e
  // }
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data = {
      listsData:{lists:this.isDelete}
    };
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.lists.deletedLists=result;
        this.lists.openSnackBar();
        this.lists.getListData();
      }
      this.lists.selection.clear();

    });
  }


  openDeleteConModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.disableClose = true;

    dialogConfig.data =
    {
      contactsData: {contacts:this.isChecked,remove:false}
    }


    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.deletedContacts=result;
        this.contacts.openSnackBar();
        this.contacts.getContacts();

      }

      this.contacts.selection.clear();

    });
  }


  removeLists(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';

    dialogConfig.disableClose = true;
    dialogConfig.data =
    {
      contactsData:{contacts:this.isChecked,remove:true}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.getContacts();
      }

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
    dialogConfig.disableClose = true;

    dialogConfig.data = {contacts:this.isChecked , listDetails:false};
    const dialogRef = this.dialog.open(ContactListsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contacts.getContacts();

      }
      this.contacts.selection.clear();

    });

  }



  changeModal(ev){
    this.listService.display=10;
    this.listService.pageNum=0;
    this.listService.email="khamis.safy@gmail.com";
    this.listService.orderedBy='';
    this.listService.search='';
    this.contacts.selection.clear();
    this.lists.selection.clear();

this.contacts.search.nativeElement.value="";
this.lists.search.nativeElement.value="";

    this.tab=this.tabs[ev.index]
    if(this.tab=='contacts'){
      this.isCanceled=false
      this.contacts.isCanceled=this.isCanceled;
      this.contacts.getContacts();
      if(this.contacts.length){
            this.contacts.paginator.pageSize=this.listService.display;
            this.contacts.paginator.pageIndex=this.listService.pageNum;
      }

      if(this.lists.length){
        this.lists.paginator.pageSize=this.listService.display;
        this.lists.paginator.pageIndex=this.listService.pageNum;
      }

    }
    else if(this.tab=='lists'){
      this.lists.getListData();
      this.lists.selection.clear();

      if(this.contacts.length){
        this.contacts.paginator.pageSize=this.listService.display;
        this.contacts.paginator.pageIndex=this.listService.pageNum;
  }
    }
    else if(this.tab=='cancel'){

      this.isCanceled=true
      this.contacts.isCanceled=this.isCanceled;

      if(this.contacts.length){
        console.log(this.contacts.length)
        this.contacts.paginator.pageSize=this.listService.display;
        this.contacts.paginator.pageIndex=this.listService.pageNum;
  }

  if(this.lists.length){
    this.lists.paginator.pageSize=this.listService.display;
    this.lists.paginator.pageIndex=this.listService.pageNum;
  }

      this.contacts.getContacts();
     }
  }
}

import { ToasterServices } from './../../../shared/components/us-toaster/us-toaster.component';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddListComponent } from '../components/lists/addList/addList.component';
import { ListsComponent } from '../components/lists/lists.component';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { ManageContactsService } from '../manage-contacts.service';
import { AddContactComponent } from '../components/contacts/addContact/addContact.component';
import { ContactListsComponent } from '../components/contacts/contactLists/contactLists.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UploadSheetComponent } from '../components/importFiles/uploadSheet/uploadSheet.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.scss'],

})
export class ManageContactsComponent implements OnInit, AfterViewInit,OnDestroy{
  tabs=["contacts","lists","cancel"];
  tabsArr=[
    {
      title:'CONTACTS',
      tab:'contacts',
      image:'assets/icons/contacts.svg',
      canceled:false

    },
    {
      title:'LISTS',
      tab:'lists',
      image:'assets/icons/lists.svg'

    },
    {
      title:'CANCELED_CONTACTS',
      tab:'cancel',
      image:'assets/icons/unsubscribe.svg',
      canceled:true


    }
  ]
  selectedTab;
  routingObservable;
  selectedTabIndex=0

  tab = this.tabs[0];
  added:boolean=false;
  isDelete;
  isChecked;
  @ViewChild(ListsComponent) lists:ListsComponent;
  @ViewChild(ContactsComponent) contacts:ContactsComponent;
  isCanceled:boolean;
  canEdit: boolean;

  constructor(public dialog: MatDialog,
    private  toaster: ToasterServices,
    private router:Router,
    private activatedRouter:ActivatedRoute,
    private listService:ManageContactsService,
    private authService:AuthService){
      this.initRouting()


  }
  initRouting(){

    this.routingObservable= this.activatedRouter.queryParams.subscribe(params=>{
      if(params["tab"]){
        this.selectedTab = params["tab"].replace(/[\s]/g)
        this.selectedTabIndex= this.tabs.indexOf(this.selectedTab)

      }
      else{
        this.selectedTab = "contacts"
        this.updateQueryParams();
      }
    })
  }
  ngAfterViewInit(){
    this.isCanceled=false;
  }

  ngOnInit() {
    let permission =this.listService.contactsPermissions
    let customerId=this.authService.userInfo.customerId;

if(permission){
  if(permission.value=="ReadOnly" || permission.value =="None"){
    this.canEdit=false
  }
  else{
    this.canEdit=true
  }

}
else{

  this.canEdit=true
}
  }
  openAddListModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='85vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
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
    dialogConfig.height='80vh';
    dialogConfig.width='45vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
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
    dialogConfig.minWidth='465px';
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

  openImportModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='80vh';
    dialogConfig.width='60vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.disableClose = true;


    const dialogRef = this.dialog.open(UploadSheetComponent,dialogConfig);

    this.contacts.selection.clear();
    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.contacts.getContacts();

      }


    });
  }
  openDeleteConModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
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
    dialogConfig.minWidth='465px';

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
    dialogConfig.minWidth='465px';
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


  updateQueryParams(){
    this.router.navigateByUrl("/contacts?tab="+this.selectedTab)
  }
  changeModal(ev){
    this.selectedTab = this.tabs[ev.index];
    this.updateQueryParams();
    this.listService.display=10;
    this.listService.pageNum=0;
    this.listService.orderedBy='';
    this.listService.search='';

  //   if(this.selectedTab=='contacts'){
  //     if(this.contacts.length){
  //           this.contacts.paginator.pageSize=this.listService.display;
  //           this.contacts.paginator.pageIndex=this.listService.pageNum;
  //     }

  //     if(this.lists.length){
  //       this.lists.paginator.pageSize=this.listService.display;
  //       this.lists.paginator.pageIndex=this.listService.pageNum;
  //     }

  //   }
  //   else if(this.selectedTab=='lists'){

  //     if(this.contacts.length){
  //       this.contacts.paginator.pageSize=this.listService.display;
  //       this.contacts.paginator.pageIndex=this.listService.pageNum;
  // }
  //   }
  //   else if(this.selectedTab=='cancel'){


  //     if(this.contacts.length){
  //       this.contacts.paginator.pageSize=this.listService.display;
  //       this.contacts.paginator.pageIndex=this.listService.pageNum;
  // }

  // if(this.lists.length){
  //   this.lists.paginator.pageSize=this.listService.display;
  //   this.lists.paginator.pageIndex=this.listService.pageNum;
  // }

  //     this.contacts.getContacts();
  //    }
  }
  exportAllContacts(){
    this.listService.exportAllContacts().subscribe(
      (res)=>{
        this.listService.exportFileData(res);

    },
      (err)=>{
      console.log(err)}

    )
  }

  exportSelectedContacts(){
    let exporedContacts=this.isChecked.map((contact)=>{
      return{
        name: contact.name,
        mobileNumber: contact.mobileNumber,
        companyName:contact.companyName ,
        note: contact.note
      }
    })
    this.listService.exportSelectedContacts(exporedContacts).subscribe(
      (res)=>{
        this.listService.exportFileData(res);
        this.contacts.selection.clear()
      },
      (err)=>{
      }
    )
  }
  ngOnDestroy(): void {
    this.routingObservable.unsubscribe()
  }
}

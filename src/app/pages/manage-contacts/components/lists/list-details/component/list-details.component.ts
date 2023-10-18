import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ContactsComponent } from '../../../contacts/contacts.component';
import { AddContactComponent } from '../../../contacts/addContact/addContact.component';
import { ListDetailsService } from '../list-details.service';
import { ListContactsComponent } from '../components/list-contacts/list-contacts.component';
import { ContactListsComponent } from '../../../contacts/contactLists/contactLists.component';
import { TotalContacts } from '../totalContacts';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UploadSheetComponent } from '../../../importFiles/uploadSheet/uploadSheet.component';


@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit ,AfterViewInit{
  listId:string;
  isChecked:Contacts[];
  list:ListData;
  count:TotalContacts;
  @ViewChild(ListContactsComponent) listContacts:ListContactsComponent;
  tabs=["contacts","canceled"];
  tab = this.tabs[0];
  canEdit: boolean;
  totalContacts:number;
  constructor(private activeRoute:ActivatedRoute,public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private listService:ManageContactsService,
    private toaster: ToasterServices,
    private router:Router,private authService:AuthService) {
    activeRoute.paramMap.subscribe((data)=>
    {
    this.listId=data.get('id');

    })
  }
  ngAfterViewInit() {
    this.listContacts.count=this.count;
    this.listContacts.getContacts();
        }

  ngOnInit() {
    this.getListData();
    let permission =this.listService.contactsPermissions

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

    getListData(){

      this.listService.getListById(this.listId).subscribe(
        (res)=>{
        this.list=res;
        this.count={totalContacts:this.list.totalContacts,totalCancelContacts:this.list.totalCancelContacts};
        this.totalContacts=this.list.totalContacts

        },

        (err)=>{
        })


    }
  changeModal(ev){
    this.tab=this.tabs[ev.index];
    this.listService.display=10;
    this.listService.pageNum=0;
    this.listContacts.selection.clear();
    if(this.listContacts.length){

      this.listContacts.paginator.pageSize=this.listService.display;
      this.listContacts.paginator.pageIndex=this.listService.pageNum;
    }
  }
  backTolists(){
this.router.navigateByUrl('contacts?tab=lists')
  }

  onChecked(e){
    this.isChecked=e;

  }


  updateTotalContacts(event){
    this.totalContacts=event
  }
  openDeleteConModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =
    {
      contactsData: {contacts:this.isChecked,remove:false}
    }

    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getListData();
        this.listContacts.getContacts();

      }

      this.listContacts.selection.clear();

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

    dialogConfig.data = {list:[this.listContacts.listId],contacts:this.listContacts.ListContacts, listDetails:true};
    const dialogRef = this.dialog.open(ContactListsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getListData();

        this.listContacts.getContacts();

      }
      this.listContacts.selection.clear();

    });

  }


  openImportModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='80vh';
    dialogConfig.width='60vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.disableClose = true;
    dialogConfig.data=this.listId

    const dialogRef = this.dialog.open(UploadSheetComponent,dialogConfig);

    this.listContacts.selection.clear();
    dialogRef.afterClosed().subscribe(result => {
      if(result){

        this.listContacts.getContacts();
      }


    });
  }

  removeContacts(){
 const dialogConfig=new MatDialogConfig();
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.disableClose = true;

    dialogConfig.data = {
      listsData:{contacts:this.isChecked,list:[this.listId]}
    };
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getListData();
        this.listContacts.getContacts();

      }
      this.listContacts.selection.clear();

    });
  }
exportAllContacts(){
  this.listService.exportContactsInList(this.listId).subscribe(
    (res)=>{this.listService.exportFileData(res)},
    (err)=>{}
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
      this.listContacts.selection.clear();

    },
    (err)=>{;
    }
  )
}
}

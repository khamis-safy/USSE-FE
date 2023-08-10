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
import { DeleteContactComponent } from '../../../contacts/deleteContact/deleteContact.component';
import { ListContactsComponent } from '../components/list-contacts/list-contacts.component';
import { ContactListsComponent } from '../../../contacts/contactLists/contactLists.component';
import { DeleteListComponent } from '../../delete-list/delete-list.component';
import { TotalContacts } from '../totalContacts';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';


@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit ,AfterViewInit{
  listId:string;
  isChecked: boolean;
  list:ListData;
  count:TotalContacts;
  @ViewChild(ListContactsComponent) listContacts:ListContactsComponent;
  tabs=["contacts","canceled"];
  tab = this.tabs[0];
  constructor(private activeRoute:ActivatedRoute,public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private listService:ManageContactsService,
    private toaster: ToasterServices,
    private router:Router) {
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

    }

    getListData(){

      this.listService.getListById(this.listId).subscribe(
        (res)=>{
        this.list=res;
        this.count={totalContacts:this.list.totalContacts,totalCancelContacts:this.list.totalCancelContacts};


        },

        (err)=>{
        this.toaster.error("Error")
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
this.router.navigateByUrl('contacts')
  }

  onChecked(e){
    this.isChecked=e;

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

}

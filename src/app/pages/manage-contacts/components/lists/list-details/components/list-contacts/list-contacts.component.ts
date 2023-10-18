import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AddContactComponent } from '../../../../contacts/addContact/addContact.component';
import { ContactsComponent } from '../../../../contacts/contacts.component';
import { TotalContacts } from '../../totalContacts';
import { LISTDETAILSHEADERS } from 'src/app/pages/manage-contacts/constants/constants';

@Component({
selector: 'app-list-contacts',
templateUrl: './list-contacts.component.html',
styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit {
listId:string;
length:number;
active:boolean=false;
ListContacts:Contacts[];
numRows;
loading:boolean=false;
subscribtions:Subscription[]=[];
WrapperScrollLeft =0;
WrapperOffsetWidth =250;
@Output() isChecked = new EventEmitter<ListData[]>;
@Input() isCanceled:boolean;
@Input() count:TotalContacts={totalContacts:0,totalCancelContacts:0};
@Input() listData:any
@ViewChild(MatPaginator)  paginator!: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
@ViewChild("search") search!:ElementRef;
@Output() updatedCount= new EventEmitter<number>;
listTableData:ListData[]=[]
deletedContacts:string[]=[];
columns :FormControl;
displayed: string[] = LISTDETAILSHEADERS;
displayedColumns: string[] = ['select','Name',"Create At",'Company',"action"];
dataSource:MatTableDataSource<Contacts>;
// dataSource = new MatTableDataSource<any>(this.listTableData);
selection = new SelectionModel<any>(true, []);

@ViewChild(ContactsComponent) contacts:ContactsComponent;
constructor(private activeRoute:ActivatedRoute,public dialog: MatDialog,
  private toaster: ToasterServices,
  private listService:ManageContactsService,
  private snackBar: MatSnackBar,) {
  activeRoute.paramMap.subscribe((data)=>
  {
  this.listId=data.get('id')
  })
}

ngOnInit() {
  this.getContacts();
  this.columns=new FormControl(this.displayedColumns)

this.selection.changed.subscribe(
  (res) => {

    if(res.source.selected.length){

      this.isChecked.emit(res.source.selected)
    }
    else{
      this.isChecked.emit()
    }
  });
}
getContacts(){

  let shows=this.listService.display;
    let pageNum=this.listService.pageNum;
    let email=this.listService.email;
    let orderedBy=this.listService.orderedBy;
    let search=this.listService.search;
    this.loading = true;
    let sub1= this.listService.getContacts(email,this.isCanceled,shows,pageNum,orderedBy,search,this.listId).subscribe(
        (res)=>{
          if(this.isCanceled){
            this.length=this.count?.totalCancelContacts;
          }
          else{
            this.length=this.count?.totalContacts;

          }
          this.numRows=res.length;
          this.loading = false;
          this.ListContacts=res;
          this.dataSource=new MatTableDataSource<Contacts>(res)
          },
          (err)=>{
          this.loading = false;

            this.length=0;
          })
          this.subscribtions.push(sub1)
    }




    isAllSelected() {
      const numSelected = this.selection.selected.length;

      const numRows =  this.numRows;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
      if (this.isAllSelected()) {

        this.selection.clear();
        return;
      }

      this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
    onSortChange(event){
      let sorting = event.active=='Name' && event.direction=='asc'?'nameASC':
                    event.active=='Name' && event.direction=='desc'?'nameDEC':

                    event.active=='Create At' && event.direction=='asc'?'createdAtASC':
                    event.active=='Create At' && event.direction=='desc'?'createdAtDEC':
                    '';
      this.listService.orderedBy=sorting;
      this.selection.clear();

      this.getContacts();


    }
    onRowClick(row:any){}

    openEditModal(data?){
      const dialogConfig=new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.height='80vh';
      dialogConfig.width='45vw';
      dialogConfig.maxWidth='100%';
      dialogConfig.minWidth='300px';
      dialogConfig.maxHeight='85vh';
      dialogConfig.data= {contacts:data,listDetails:true,list:this.listData};
      const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);
      this.selection.clear();
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getContacts();
          this.getListData();
              }

      });

    }
    onPageChange(event){
      this.listService.display=event.pageSize;
      this.listService.pageNum=event.pageIndex;
      this.selection.clear();

      this.getContacts();

    }
    onSearch(event:any){
      this.listService.search=event.value;
      this.selection.clear();

      this.getContacts();
    }
    toggleActive(data?){
      if(data){
      }
      this.active=!this.active;
    }
    changeColumns(event){


        this.displayedColumns=['select',...event,'action']


    }
    getListData(){

      this.listService.getListById(this.listId).subscribe(
        (res)=>{
        this.count={totalContacts:res.totalContacts,totalCancelContacts:res.totalCancelContacts};
        this.updatedCount.emit(res.totalContacts)
        if(this.isCanceled){
          this.length=this.count?.totalCancelContacts;
        }
        else{
          this.length=this.count?.totalContacts;

        }
        },

        (err)=>{
        })


    }
}

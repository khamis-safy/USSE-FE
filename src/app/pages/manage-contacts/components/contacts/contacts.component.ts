import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../manage-contacts.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ListData } from '../../list-data';
import { Contacts } from '../../contacts';
import { AddContactComponent } from './addContact/addContact.component';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({

  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent  implements OnInit ,OnDestroy {
  length:number;
  numRows;
  loading;

  @Input() isCanceled:boolean;
  @Output() isDelete = new EventEmitter<Contacts[]>;
  @Output() isChecked = new EventEmitter<Contacts[]>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef
  @ViewChild(MatSort) sort: MatSort;


  listTableData:ListData[]=[]
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Name','Mobile','Notes','Lists','Company Name','Create At'];
  displayedColumns: string[] = ['select','Name', 'Mobile', 'Notes', "Lists",'Company Name',"Create At","action"];
  dataSource:MatTableDataSource<Contacts>;
  selection = new SelectionModel<Contacts>(true, []);
  subscribtions:Subscription[]=[];
  @Input() listId:string="";

  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  isSearch: boolean;
  noData: boolean=false;
  notFound: boolean=false;
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar,

  ) {
    }


    @Input('isUnsubscribe') isUnsubscribe = false;

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

  openSnackBar(){
    let message = `${this.deletedContacts.length} Item(s) Deleted`;
    let action ="Undo"
    let snackBarRef=this.snackBar.open(message,action,{duration:4000});
    snackBarRef.onAction().subscribe(()=>{
      this.undoDelete();
    })
  }
  undoDelete(){
    let email=this.listService.email;
    this.listService.unDeleteContact(email,this.deletedContacts).subscribe(
      (res)=>{

        this.toaster.success('Success');
        this.getContacts();
        this.deletedContacts=[];


      },
      (err)=>{

        this.toaster.error("Error")

      }
    )

  }





  getContacts(){
    this.contactsCount();
  let shows=this.listService.display;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy=this.listService.orderedBy;
  let search=this.listService.search;
  let isCanceled=this.isUnsubscribe;
  this.loading = true;

   let sub1= this.listService.getContacts(email,this.isCanceled,shows,pageNum,orderedBy,search,this.listId).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
        if(this.isCanceled){
          this.displayedColumns= ['select','Name', 'Mobile', 'Notes', "Lists",'Company Name',"Create At"];

        }

        this.dataSource=new MatTableDataSource<Contacts>(res);
        if(search!=""){
          this.length=res.length;
          if(this.length==0){
            this.notFound=true;
          }
          else{
            this.notFound=false;
          }
          this.isSearch=true;

      }
      else{
        this.isSearch=false;

        this.contactsCount();

      }

       },
       (err)=>{
        this.loading = false;
        this.length=0;

       })
       this.subscribtions.push(sub1)
  }




  contactsCount(){
    let email=this.listService.email;

    let sub2=this.listService.contactsCount(email,this.isCanceled).subscribe(

      (res)=>{
        this.length=res;
        if(this.length==0){
          this.noData=true
        }
        else{
          this.noData=false
        }
      }
      ,(err)=>{
        this.length=0;
      }
    )
this.subscribtions.push(sub2)

  }


  /** Whether the number of selected elements matches the total number of rows. */
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
    dialogConfig.height='70vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;

    dialogConfig.data= {contacts:data,listDetails:false};
    const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);
    this.selection.clear();
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getContacts();
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

  selectedRow(event){
  }
  scrollRight(wrapper){
    this.WrapperOffsetWidth = wrapper.offsetWidth
    this.WrapperScrollLeft =wrapper.scrollLeft+100

    wrapper.scrollTo({
      left: this.WrapperScrollLeft,
      behavior: "smooth",
    })

  }
  scrollLeft(wrapper){
    this.WrapperScrollLeft =wrapper.scrollLeft-100
    if(this.WrapperScrollLeft<0)this.WrapperScrollLeft =0;
    wrapper.scrollTo({
      left: this.WrapperScrollLeft,
      behavior: "smooth",
    })


}
changeColumns(event){
  if(this.isCanceled){
    this.displayedColumns=['select',...event]

  }
  else{
    this.displayedColumns=['select',...event,'action']
  }

}
ngOnDestroy(){
  this.subscribtions.map(e=>e.unsubscribe());
}

}

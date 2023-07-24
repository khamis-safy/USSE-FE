import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../manage-contacts.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ListData } from '../../list-data';
import { AddListComponent } from '../lists/addList/addList.component';
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
export class ContactsComponent  implements OnInit ,AfterViewInit {
  length:number;
  active:boolean=false;
  testListContacts:Contacts[]=[]
  numRows;
  loading;
  subscribtions:Subscription[]=[];

  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  @Input() isCanceled:boolean;
  @Output() isDelete = new EventEmitter<ListData[]>;
  @Output() isChecked = new EventEmitter<ListData[]>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChildren("check") checks:any;
  listTableData:ListData[]=[]
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Name','Mobile','Notes','Lists','Company Name','Create At'];
  displayedColumns: string[] = ['select','Name', 'Mobile', 'Notes', "Lists",'Company Name',"Create At","action"];
  dataSource:MatTableDataSource<Contacts>;
  @Input() listId:string="";
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
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
          console.log("selected",res.source.selected)

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
    let email='khamis.safy@gmail.com';
    this.listService.unDeleteContact(email,this.deletedContacts).subscribe(
      (res)=>{

        console.log(res)
        this.toaster.success('Success');
        this.getContacts();
        this.deletedContacts=[];


      },
      (err)=>{
        console.log(err)
        this.toaster.error("Error")

      }
    )

    console.log("Deleted contacts",this.deletedContacts)
  }

  getContacts(){
this.contactsCount();
  let shows=this.listService.display;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy=this.listService.orderedBy;
  let search=this.listService.search;
  let isCanceled=this.isUnsubscribe;
  console.log('isCanceled', this.isUnsubscribe)
  this.loading = true;

console.log("is canceled" ,this.isCanceled)
   let sub1= this.listService.getContacts(email,this.isCanceled,shows,pageNum,orderedBy,search,this.listId).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
if(this.isCanceled){
  this.displayedColumns= ['select','Name', 'Mobile', 'Notes', "Lists",'Company Name',"Create At"];

}

        this.dataSource=new MatTableDataSource<Contacts>(res)
      console.log("all contacts",res);
       },
       (err)=>{
        this.loading = false;
        this.length=0;
         console.log(err);
       })
       this.subscribtions.push(sub1)
  }




  contactsCount(){
    let email=this.listService.email;

    let sub2=this.listService.contactsCount(email,this.isCanceled).subscribe(

      (res)=>{
        this.length=res;
        // this.length=0;

        console.log("pages count contacts",res);
        console.log("length",this.length)

      }
      ,(err)=>{console.log(err);
        this.length=0;}
    )
this.subscribtions.push(sub2)

  }

  ngAfterViewInit(): void {
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
    console.log("sorting from onSortChange function ",this.listService.orderedBy);
    this.getContacts();


  }
  onRowClick(row:any){}

  openEditModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='90vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data= {contacts:data,listDetails:false};
    const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getContacts();
            }

    });

  }
  onPageChange(event){
    this.listService.display=event.pageSize;
    this.listService.pageNum=event.pageIndex;
    this.getContacts();
    // console.log("onPageChange",this.listService.display,event);

  }
  onSearch(event:any){
    this.listService.search=event.value;
    console.log(this.listService.search);
    this.getContacts();
  }
  toggleActive(data?){
    if(data){
      console.log("row data",data)
    }
    console.log("active before",this.active)
    this.active=!this.active;
    console.log("active after",this.active)
  }
  selectedRow(event){
    console.log("selected row",event)
  }
  scrollRight(wrapper){
    this.WrapperOffsetWidth = wrapper.offsetWidth
    this.WrapperScrollLeft =wrapper.scrollLeft+100
    console.log(this.WrapperOffsetWidth )

    wrapper.scrollTo({
      left: this.WrapperScrollLeft,
      behavior: "smooth",
    })

  }
  scrollLeft(wrapper){
    console.log(wrapper)
    this.WrapperScrollLeft =wrapper.scrollLeft-100
    if(this.WrapperScrollLeft<0)this.WrapperScrollLeft =0;
    console.log(this.WrapperScrollLeft )
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

destroy() {
  this.subscribtions.map(e=>e.unsubscribe());
  this.dataSource.data=[];
  console.log("contacts Destroyed success")

}
}

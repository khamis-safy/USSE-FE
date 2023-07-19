import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { Contacts } from '../../contacts';
import { ListData } from '../../list-data';
import { ManageContactsService } from '../../manage-contacts.service';
import { AddContactComponent } from '../contacts/addContact/addContact.component';

@Component({
  selector: 'app-canceled',
  templateUrl: './canceled.component.html',
  styleUrls: ['./canceled.component.scss']
})
export class CanceledComponent implements OnInit {
  length:number;
  active:boolean=false;
  testListContacts:Contacts[]=[]
  numRows;
  loading;
  subscribtions:Subscription[]=[];


  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  isCanceled:boolean=true;

  @Output() deleteCanceled = new EventEmitter<ListData[]>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChildren("check") checks:any;
  listTableData:ListData[]=[]
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Name','Mobile','Notes','Lists','Company Name','Create At'];
  displayedColumns: string[] = ['select','Name', 'Mobile', 'Notes', "Lists",'Company Name',"Create At","action"];
  dataSource:MatTableDataSource<Contacts>;
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar,

  ) {
    }


  ngOnInit() {
    this.columns=new FormControl(this.displayedColumns)

    this.selection.changed.subscribe(
      (res) => {

        if(res.source.selected.length){
          console.log("selected",res.source.selected)

          this.deleteCanceled.emit(res.source.selected)
        }
        else{
          this.deleteCanceled.emit()
        }
      });
  }
  getContacts(){
    this.contactsCount();
      let shows=this.listService.display;
      let pageNum=this.listService.pageNum;
      let email=this.listService.email;
      let orderedBy=this.listService.orderedBy;
      let search=this.listService.search;
      this.loading = true;


       let sub1= this.listService.getContacts(email,this.isCanceled,shows,pageNum,orderedBy,search).subscribe(
          (res)=>{
            this.numRows=res.length;
            this.loading = false;
            if(this.isCanceled){
              console.log("canceled contacts",this.isCanceled)
            }
            this.dataSource=new MatTableDataSource<Contacts>(res)
          console.log("all contacts",res);
           },
           (err)=>{
            this.loading = false;

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
          ,(err)=>{console.log(err)}
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
    let sorting = event.active=='name' && event.direction=='asc'?'nameASC':
                  event.active=='name' && event.direction=='desc'?'nameDEC':

                  event.active=='createdAt' && event.direction=='asc'?'createdAtASC':
                  event.active=='createdAt' && event.direction=='desc'?'createdAtDEC':
                  '';
    this.listService.orderedBy=sorting;
    console.log("sorting from onSortChange function ",this.listService.orderedBy);
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
    dialogConfig.data= data;
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
  this.displayedColumns=['select',...event,'action']

}

destroy() {
  this.subscribtions.map(e=>e.unsubscribe());
  this.dataSource.data=[];
  console.log("contacts Destroyed success")

}
}

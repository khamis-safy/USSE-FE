import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewChildren, Input } from '@angular/core';
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
export class ContactsComponent  implements OnInit ,AfterViewInit ,OnDestroy{
  length:number=0;
  active:boolean=false;
  testListContacts:Contacts[]=[]
  numRows;
  loading;
  subscribtions:Subscription[]=[];

  @ViewChild(MatPaginator)  paginator!: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren("check") checks:any;
  listTableData:ListData[]=[]
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Name','Mobile','Notes','Lists','Company Name','Create At'];
  displayedColumns: string[] = ['select','Name', 'Mobile', 'Notes', "Lists",'Company Name',"Create At","action"];
  dataSource:MatTableDataSource<Contacts>;
  show:boolean=false;
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar
  ) {
    }

    @Output() isDelete = new EventEmitter<ListData[]>;
    WrapperScrollLeft =0
    WrapperOffsetWidth =250
    @Output() isChecked = new EventEmitter<ListData[]>;
    @Input('isUnsubscribe') isUnsubscribe = false;

  ngOnInit() {

    this.columns=new FormControl(this.displayedColumns)

    this.getContacts();
    // this.contactsCount()
    this.selection.changed.subscribe(
      (res) => {

        if(res.source.selected.length){
          this.show=true;

          this.isChecked.emit(res.source.selected)
        }
        else{
          this.show=false
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
    console.log('isCanceled', this.isUnsubscribe)
//     let shows=this.listService.display;
//     let pageNum=this.listService.pageNum;
//     let email=this.listService.email;
//     let orderedBy=this.listService.orderedBy;
//     let search=this.listService.search;

//     console.log(`from get contact data inside list component number of shows is:${shows} page number is ${pageNum} orderBy is ${orderedBy} search is ${search}`)


// this.testListContacts=[

// {id: 'ct_105e9c1d-74b8-4167-8160-3ac4cc3a789a', name: 'con', mobileNumber: '9879834234', companyName: '', note: '',createdAt: "2023-06-23T22:12:39.2610235",lists: [
//   {
//       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "ADP",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-06-19T22:41:50.2533008Z",
//       isCheckedd: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     },

//     {
//       id: "sjfksjdflksjdlkjsdlkgj-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "VIP",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-05-19T22:41:50.2533008Z",
//       isCheckedd: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     }]},

// {id: 'ct_fb9c58f2-6936-4a64-86c2-dd40a637e5e7', name: 'contact', mobileNumber: '0876876776', companyName: 'string', note: 'test',createdAt: "2023-06-23T22:12:39.2610235",lists: [
//   {
//       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "ADP",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-06-19T22:41:50.2533008Z",
//       isCheckedd: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     },
//     {
//       id: "sjfksjdflksjdlkjsdlkgj-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "VIP",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-05-19T22:41:50.2533008Z",
//       isCheckedd: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     }]},

// {id: 'ct_f32e89a1-8eca-4e7e-9990-b98783fb2fdc', name: 'khamis', mobileNumber: '201206836206', companyName: "null", note: "null",createdAt: "2023-06-23T22:12:39.2610235",lists: [
//   {
//       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "ADP",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-06-19T22:41:50.2533008Z",
//       isCheckedd: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     },
//     {
//       id: "sjfksjdflksjdlkjsdlkgj-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "VIP",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-05-19T22:41:50.2533008Z",
//       isCheckedd: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     }]}

// ];
// this.dataSource=new MatTableDataSource<Contacts>(this.testListContacts)

this.contactsCount();
  let shows=this.listService.display;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy=this.listService.orderedBy;
  let search=this.listService.search;
  let isCanceled=this.isUnsubscribe;
  console.log('isCanceled', this.isUnsubscribe)
  this.loading = true;
   let sub1= this.listService.getContacts(email,shows,pageNum,orderedBy,search,isCanceled).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;

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

    let sub2=this.listService.contactsCount(email).subscribe(
      (res)=>{
        this.length=res;
        // this.length=0;

        console.log("pages count contacts",res);

      }
      ,(err)=>{console.log(err)}
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
    dialogConfig.height='90vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
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

ngOnDestroy() {
  this.subscribtions.map(e=>e.unsubscribe());
  this.dataSource.data=[];
  console.log("contacts Destroyed success")

}
}

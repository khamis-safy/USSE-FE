import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../manage-contacts.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ListData } from '../../list-data';
import { AddListComponent } from '../lists/addList/addList.component';
import { Contacts } from '../../contacts';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent  implements OnInit ,AfterViewInit {
  length:number=0;
  active:boolean=false;
  testListContacts:Contacts[]=[]

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  toppings = new FormControl('');
  @ViewChild(MatSort) sort: MatSort;
  toppingList: string[] = ['Name', 'Create At	', 'Total Contacts'];
  listTableData:ListData[]=[]
  displayedColumns: string[] = ['select','name', 'mobile', 'notes', "lists",'companyName',"createAt","action"];
  dataSource:MatTableDataSource<Contacts>;
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService) {
    }
    @Output() isDelete = new EventEmitter<ListData[]>;
  ngOnInit() {
    this.getContacts();
    this.contactsCount()

  }
  getContacts(){



// this.testListContacts=[

// {id: 'ct_105e9c1d-74b8-4167-8160-3ac4cc3a789a', name: 'con', mobileNumber: '9879834234', companyName: '', note: '',createdAt: "2023-06-23T22:12:39.2610235",lists: [
//   {
//       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "Carbon",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-06-19T22:41:50.2533008Z",
//       isDeleted: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     },
//     {
//       id: "sjfksjdflksjdlkjsdlkgj-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "Nitrogen",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-05-19T22:41:50.2533008Z",
//       isDeleted: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     }]},

// {id: 'ct_fb9c58f2-6936-4a64-86c2-dd40a637e5e7', name: 'contact', mobileNumber: '0876876776', companyName: 'string', note: 'test',createdAt: "2023-06-23T22:12:39.2610235",lists: [
//   {
//       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "Carbon",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-06-19T22:41:50.2533008Z",
//       isDeleted: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     },
//     {
//       id: "sjfksjdflksjdlkjsdlkgj-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "Nitrogen",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-05-19T22:41:50.2533008Z",
//       isDeleted: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     }]},

// {id: 'ct_f32e89a1-8eca-4e7e-9990-b98783fb2fdc', name: 'khamis', mobileNumber: '201206836206', companyName: null, note: null,createdAt: "2023-06-23T22:12:39.2610235",lists: [
//   {
//       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "Carbon",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-06-19T22:41:50.2533008Z",
//       isDeleted: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     },
//     {
//       id: "sjfksjdflksjdlkjsdlkgj-4a50-49f9-9f3c-fd54b8b273ca",
//       name: "Nitrogen",
//       totalContacts: 0,
//       totalCancelContacts: 0,
//       createdAt: "2023-05-19T22:41:50.2533008Z",
//       isDeleted: false,
//       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
//     }]}

// ];
// this.dataSource=new MatTableDataSource<Contacts>(this.testListContacts)

  let shows=this.listService.display;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy=this.listService.orderedBy;
  let search=this.listService.search;
    this.listService.getContacts(email,shows,pageNum,orderedBy,search).subscribe(
      (res)=>{
        this.dataSource=new MatTableDataSource<Contacts>(res)
      console.log("all contacts",res);
       },
       (err)=>{
         console.log(err);
       })
  }
  addContact(){
    this.listService.addContact("con2","98798399934","","","khamis.safy@gmail.com",["ls_44b7b8e2-87fa-4526-bfc7-c10ce5541397"]).subscribe(
      (res)=>{
        console.log("added successfully",res)
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  updateContact(){
    this.listService.updateContact("ct_7215c018-7c20-4a97-86f6-ae2e2b4a2ef0","update","098786876","company","note","khamis.safy@gmail.com").subscribe(
      (res)=>{
        console.log("updated successfully",res)
      },
      (err)=>{
        console.log(err)
      }
    )
  }
  deleteContact(){
    this.listService.deleteContact("khamis.safy@gmail.com",["ct_9ccb3954-33c2-4bf6-8045-0c66d929853e"]).subscribe(
      (res)=>{
        console.log("deleted successfully",res)
      },
      (err)=>{
        console.log(err) }
        )
  }
  contactsCount(){
    let email=this.listService.email;

    this.listService.contactsCount(email).subscribe(
      (res)=>{
        this.length=res;
        console.log("pages count contacts",res);

      }
      ,(err)=>{console.log(err)}
    )


  }

  ngAfterViewInit(): void {
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.length;
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
    dialogConfig.height='85vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.data= data;
    const dialogRef = this.dialog.open(AddListComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){

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
}


import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddListComponent } from './addList/addList.component';
import { ManageContactsService } from '../../manage-contacts.service';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ListData } from '../../list-data';
import { Contacts } from '../../contacts';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})


export class ListsComponent implements OnInit ,AfterViewInit  {
length:number=0;
active:boolean=false;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  toppings = new FormControl('');
  @ViewChild(MatSort) sort: MatSort;
  toppingList: string[] = ['Name', 'Create At	', 'Total Contacts'];
  listTableData:ListData[]=[]
  displayedColumns: string[] = ['select', 'name', 'createdAt', 'totalContacts',"edit"];
  dataSource:MatTableDataSource<ListData>;
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService) {
  }
  @Output() isDelete = new EventEmitter<ListData[]>;

  ngOnInit() {
    // this.getListsCount();
    // this.getListData();
    // this.length=10

    this.selection.changed.subscribe(
      (res) => {
        console.log("selected data",res)
        if(res.source.selected.length){
          console.log("selected",res.source.selected)
          this.isDelete.emit(res.source.selected)
        }
        else{
          this.isDelete.emit()
        }
      });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }
getListsCount(){
  let email=this.listService.email;

  this.listService.ListsCount(email).subscribe(
    (res)=>{
      this.length=res;
      console.log("pages count",res);

    }
    ,(err)=>{console.log(err)}
  )
}

getListData(){
  this.getListsCount();
  let shows=this.listService.display;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy=this.listService.orderedBy;
  let search=this.listService.search;


  console.log(`from git list data inside list component number of shows is:${shows} page number is ${pageNum} orderBy is ${orderedBy} search is ${search}`)
  // this.listTableData=[
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
  //     },
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
  //       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
  //       name: "Nitrogen",
  //       totalContacts: 0,
  //       totalCancelContacts: 0,
  //       createdAt: "2023-06-19T22:41:50.2533008Z",
  //       isDeleted: false,
  //       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
  //     },
  //     {
  //       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
  //       name: "Carbon",
  //       totalContacts: 0,
  //       totalCancelContacts: 0,
  //       createdAt: "2023-06-19T22:41:50.2533008Z",
  //       isDeleted: false,
  //       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
  //     },
  //     {
  //       id: "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
  //       name: "Nitrogen",
  //       totalContacts: 0,
  //       totalCancelContacts: 0,
  //       createdAt: "2023-06-19T22:41:50.2533008Z",
  //       isDeleted: false,
  //       applicationUserId: "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
  //     }

  // ]


  // this.dataSource=new MatTableDataSource<ListData>(this.listTableData)

  this.listService.getList(email,shows,pageNum,orderedBy,search).subscribe(
     (res)=>{
        console.log(res);
  this.dataSource=new MatTableDataSource<ListData>(res)
console.log("from get api",this.dataSource)
      },
      (err)=>{
        console.log(err);
      })
}
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.listService.display;
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
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  undeleteList(){
    this.listService.unDeleteList("khamis.safy@gmail.com",["ls_227b8063-0567-4fb5-9ea6-f81f9fa3499c"]).subscribe(
      (res)=>{
        console.log("undelete",res)
      },
      (err)=>{
        console.log(err) }
        )
  }
  onSortChange(event){
    let sorting = event.active=='name' && event.direction=='asc'?'nameASC':
                  event.active=='name' && event.direction=='desc'?'nameDEC':

                  event.active=='createdAt' && event.direction=='asc'?'createdAtASC':
                  event.active=='createdAt' && event.direction=='desc'?'createdAtDEC':
                  '';
    this.listService.orderedBy=sorting;
    console.log("sorting from onSortChange function ",this.listService.orderedBy)
    this.getListData();

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
        this.getListsCount();
        this.getListData()
      }
    });

  }
  onPageChange(event){
    this.listService.display=event.pageSize;
    this.listService.pageNum=event.pageIndex;
    // console.log("onPageChange",this.listService.display,event);
    this.getListData();
  }
  onSearch(event:any){
    this.listService.search=event.value;
    console.log(this.listService.search);
    this.getListData();
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

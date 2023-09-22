import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddListComponent } from './addList/addList.component';
import { ManageContactsService } from '../../manage-contacts.service';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ListData } from '../../list-data';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LISTHEADERS } from '../../constants/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})


export class ListsComponent implements OnInit ,AfterViewInit  {
length:number=0;
active:boolean=false;
numRows;
loading;
subscribtions:Subscription[]=[];
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef;
  noData: boolean=false;
  notFound: boolean=false;
  columns :FormControl;
  @ViewChild(MatSort) sort: MatSort;
  displayed: any[] = LISTHEADERS;
  listTableData:ListData[]=[]
  displayedColumns: string[] = ['select', 'Name', 'Create At', 'Total Contacts',"edit"];
  dataSource:MatTableDataSource<ListData>;
  deletedLists:string[]=[];
  // dataSource = new MatTableDataSource<any>(this.listTableData);
  selection = new SelectionModel<any>(true, []);
  @Input()canEdit:boolean;
  cellClick:boolean;

  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router:Router) {
  }

  @Output() isDelete = new EventEmitter<ListData[]>;

  ngOnInit() {
    // this.getListsCount();
    // this.getListData();
    // this.length=10
    if(!this.canEdit){
      this.displayedColumns = ['select', 'Name', 'Create At', 'Total Contacts'];

    }

    this.columns=new FormControl(this.displayedColumns)
    this.selection.changed.subscribe(
      (res) => {
        if(res.source.selected.length){
          this.isDelete.emit(res.source.selected)
        }
        else{
          this.isDelete.emit()
        }
      });
  }

  ngAfterViewInit() {
  }
getListsCount(){
  let email=this.listService.email;

 let sub1= this.listService.ListsCount(email).subscribe(
    (res)=>{
      this.length=res;
      // this.length=0;
      if(this.length==0){
        this.noData=true
      }
      else{
        this.noData=false
      }

    }
    ,(err)=>{
      this.length=0;}
  );
  this.subscribtions.push(sub1)
}

getListData(){

  let shows=this.listService.display;
  let pageNum=this.listService.pageNum;
  let email=this.listService.email;
  let orderedBy=this.listService.orderedBy;
  let search=this.listService.search;

  this.loading = true;



 let sub2= this.listService.getList(email,shows,pageNum,orderedBy,search).subscribe(
     (res)=>{
      this.loading = false;
      console.log(res)

        this.numRows=res.length;
  this.dataSource=new MatTableDataSource<ListData>(res);
        if(search!=""){
          this.length=res.length;
          if(this.length==0){
            this.notFound=true;
          }
          else{
            this.notFound=false;
          }
      }
      else{
        this.getListsCount();

      }
      },
      (err)=>{
        this.loading = false;
        this.length=0

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


  openSnackBar(){
    let message = `${this.deletedLists.length} Item(s) Deleted`;
    let action ="Undo"
    let snackBarRef=this.snackBar.open(message,action,{duration:4000});
    snackBarRef.onAction().subscribe(()=>{
      this.undoDelete();
    })
  }
  undoDelete(){
    let email=this.listService.email;
    this.listService.unDeleteList(email,this.deletedLists).subscribe(
      (res)=>{



        this.getListData();
        this.deletedLists=[];


      },
      (err)=>{

      }
    )

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


  onSortChange(event){
    let sorting = event.active=='Name' && event.direction=='asc'?'nameASC':
                  event.active=='Name' && event.direction=='desc'?'nameDEC':

                  event.active=='Create At' && event.direction=='asc'?'createdAtASC':
                  event.active=='Create At' && event.direction=='desc'?'createdAtDEC':
                  '';
    this.listService.orderedBy=sorting;
    this.selection.clear();
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
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AddListComponent,dialogConfig);
    this.selection.clear();
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
    this.selection.clear();


    this.getListData();
  }
  onSearch(event:any){
    this.listService.search=event.value;
    this.selection.clear();

    this.getListData();
  }
  toggleActive(data?){
    if(data){
    }
    this.active=!this.active;
  }
  selectedRow(event){
  }

  changeColumns(event){
    if(this.canEdit){
      this.displayedColumns=['select',...event,'edit']
    }
    else{
      this.displayedColumns=[...event]
    }



  }
  destroy() {
    this.subscribtions.map(e=>e.unsubscribe());
    this.dataSource.data=[];
  }

  navigateTo(id:string){
    if(!this.cellClick){
    this.router.navigateByUrl(`list/${id}`)
    }
  }
}

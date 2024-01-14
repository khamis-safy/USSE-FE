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
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { LISTHEADERS } from '../../constants/constants';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})


export class ListsComponent implements OnInit ,AfterViewInit  ,OnDestroy{
  tableData:any=[]
length:number=0;
active:boolean=false;
numRows;
loading:boolean=true;
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
  display: number;
  pageNum:number;
  isSmallScreen: boolean = false;

  destroy$: Subject<void> = new Subject<void>();
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private authService:AuthService,
    private router:Router,
    private breakpointObserver: BreakpointObserver
    ) {
      this.display=this.listService.getUpdatedDisplayNumber();
      this.pageNum=this.listService.pageNum;
  }

  @Output() isDelete = new EventEmitter<ListData[]>;

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)'])
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      this.isSmallScreen = result.matches;
      if(!this.isSmallScreen){
        this.selection.clear()
        this.getListData();

      }
    });
  
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
  this.loading=true;

  let email=this.authService.getUserInfo()?.email;

 let sub1= this.listService.ListsCount(email).subscribe(
  (res)=>{
    this.length=res;
    this.loading = false;
    if( this.length==0){
    this.noData=true;

    }
    else{
      this.noData=false;
    }
    },
    (err)=>{
     
     this.loading = false;
     this.length=0;
     this.noData=true;
    });
 
  this.subscribtions.push(sub1)
}

getListData(searchVal?){

  let shows=this.listService.display;
  let email=this.authService.getUserInfo()?.email;
  let orderedBy=this.listService.orderedBy;
  let search=searchVal ? searchVal : "";
  let pageNumber=searchVal?0:this.pageNum

  this.loading = true;


  if(searchVal && this.paginator){
    this.paginator.pageIndex=0
  }
  let sub2= this.listService.getList(email,shows,pageNumber,orderedBy,search).subscribe(
    (res)=>{
      this.loading = false;

        this.numRows=res.length;
  this.dataSource=new MatTableDataSource<ListData>(res);
  this.tableData=res;
  this.tableData.forEach(element => {
element.defaultExpanded = true; // Set to true or false based on your logic
});
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
        this.paginator.pageIndex=this.pageNum
        this.notFound=false;
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
    let message = `${this.deletedLists.length} ${this.translate.instant('Item(s) Deleted')}`;
    let action =this.translate.instant("Undo")
    let snackBarRef=this.snackBar.open(message,action,{duration:4000});
    snackBarRef.onAction().subscribe(()=>{
      this.undoDelete();
    })
  }
  undoDelete(){
    let email=this.authService.getUserInfo()?.email;
    this.listService.unDeleteList(email,this.deletedLists).subscribe(
      (res)=>{



        this.getListData();
        this.deletedLists=[];
        this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));


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
    dialogConfig.minWidth='465px';
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
    this.pageNum=event.pageIndex;
    this.selection.clear();

    this.listService.updateDisplayNumber(event.pageSize)

    this.getListData();
  }
  onSearch(event:any){
    this.selection.clear();

    this.getListData(event.value);
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
  ngOnDestroy(){
    this.selection.clear();

    this.subscribtions.map(e=>e.unsubscribe());
    this.dataSource.data=[];
  }

  navigateTo(id:string){
    if(!this.cellClick){
    this.router.navigateByUrl(`list/${id}`)
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { DevicesService } from '../devices.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { StepsComponent } from '../components/steps/steps.component';
import { DeviceData } from '../device';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit{
  length:number;
  active:boolean=false;
  numRows;
  loading;

  @Input() isCanceled:boolean;
  @Output() isDelete = new EventEmitter<DeviceData[]>;
  @Output() isChecked = new EventEmitter<DeviceData[]>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChildren("check") checks:any;
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Device Name', 'Device Type', 'Number',"Create At", "Status"];
  displayedColumns: string[] = ['select','Device Name', 'Device Type', 'Number',"Create At", "Status","action"];
  dataSource:MatTableDataSource<DeviceData>;
  selection = new SelectionModel<any>(true, []);
  constructor(public dialog: MatDialog,private  toaster: ToasterServices,private devicesService:DevicesService){
  }
  ngOnInit() {
    this.getDevices();
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
                  '';

    // this.getDevices();


  }
  getDevices(){
    let shows=this.devicesService.display;
    let pageNum=this.devicesService.pageNum;
    let email=this.devicesService.email;
    let orderedBy=this.devicesService.orderedBy;
    let search=this.devicesService.search;
    this.loading = true;
    this.devicesService.getDevices(email,shows,pageNum,orderedBy,search).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
        this.dataSource=new MatTableDataSource<DeviceData>(res)
      console.log("all contacts",res);
       },
       (err)=>{
        this.loading = false;
        this.length=0;
         console.log(err);
       })
  }
  openStepsModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='95vh';
    dialogConfig.width='70vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    const dialogRef = this.dialog.open(StepsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });


  }
  openEditModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='70vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    // dialogConfig.data= {contacts:data,listDetails:false};
    // const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);
    // this.checks._results=[]
    // this.selection.clear();
    // dialogRef.afterClosed().subscribe(result => {
    //   if(result){
    //         }


    // });

  }
  changeColumns(event){
    if(this.isCanceled){
      this.displayedColumns=['select',...event]

    }
    else{
      this.displayedColumns=['select',...event,'action']
    }

  }

  onPageChange(event){
    // this.listService.display=event.pageSize;
    // this.listService.pageNum=event.pageIndex;
    // this.getDevices();

  }
  onSearch(event:any){
    // this.listService.search=event.value;
    // console.log(this.listService.search);
    // // this.getDevices();
  }
  toggleActive(data?){
    if(data){
      console.log("row data",data)
    }
    console.log("active before",this.active)
    this.active=!this.active;
    console.log("active after",this.active)
  }
}

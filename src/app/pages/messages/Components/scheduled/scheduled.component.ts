import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {  Shceduled } from '../../message';
import { MessagesService } from '../../messages.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisplayMessageComponent } from '../display-message/display-message.component';



@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit  {
  length:number=0;
  numRows;
  loading:boolean=false;
  @Output() isChecked = new EventEmitter<Shceduled[]>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;

  columns :FormControl;
  displayed: string[] = ['Device Name', 'Recipient', 'Messages', 'Created At','Scheduled At'];
  displayedColumns: string[] = ['select' ,'Device Name', 'Recipient', 'Messages', 'Created At','Scheduled At'];
  dataSource:MatTableDataSource<Shceduled>;
  selection = new SelectionModel<Shceduled>(true, []);

  subscribtions:Subscription[]=[];
  constructor(private messageService:MessagesService,public dialog: MatDialog){}
  ngOnInit() {
    this.getMessages();

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

    getMessages(){
      this.getMessagesCount();
      let shows=this.messageService.display;
      let pageNum=this.messageService.pageNum;
      let email=this.messageService.email;
      this.loading=true;
      let messagesSub=this.messageService.getScheduledMessages(email,shows,pageNum).subscribe(
        (res)=>{
          this.numRows=res.length;
          this.loading = false;
          this.dataSource=new MatTableDataSource<Shceduled>(res)

        },
        (err)=>{
         this.loading = false;
         this.length=0;

        }
      )
      this.subscribtions.push(messagesSub)
    }

    getMessagesCount(){
      let email=this.messageService.email;
      let countSub=this.messageService.listScheduledMessagesCount(email).subscribe(
        (res)=>{
          this.length=res;
        }
        ,(err)=>{
          this.length=0;
        }
      )

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

    checkboxLabel(row?): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    changeColumns(event){
      //  change displayed column based on component type
      this.displayedColumns=['select',...event]

      }

      onPageChange(event){
        this.messageService.display=event.pageSize;
        this.messageService.pageNum=event.pageIndex;
        this.selection.clear();

        this.getMessages();

      }
      displayMessage(row){
        // const dialogConfig=new MatDialogConfig();
        // dialogConfig.height='100vh';
        // dialogConfig.width='25vw';
        // dialogConfig.maxWidth='100%';
        // // dialogConfig.minWidth='200px';
        // dialogConfig.disableClose = true;
        // dialogConfig.position = { right: '2px'};
        // dialogConfig.direction ="ltr";
        // dialogConfig.data=row;
        // const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);

        // dialogRef.afterClosed().subscribe(result => {
        //   if(result){
        //   }

        // });

      }

}



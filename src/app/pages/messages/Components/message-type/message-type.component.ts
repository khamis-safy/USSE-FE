import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MessagesService } from '../../messages.service';
import { FormControl } from '@angular/forms';
import { Message } from '../../message';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisplayMessageComponent } from '../display-message/display-message.component';

@Component({
  selector: 'app-message-type',
  templateUrl: './message-type.component.html',
  styleUrls: ['./message-type.component.scss']
})
export class MessageTypeComponent implements OnInit ,OnDestroy {

  length:number=0;
  numRows;
  loading:boolean=false;
  @Input() msgCategory:string="inbox"
  @Output() isChecked = new EventEmitter<Message[]>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef

  columns :FormControl;
  displayed: string[] = ['Device Name', 'Sender', 'Messages', 'Received At'];
  displayedColumns: string[] = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At','Updated At','Status','Ation'];
  dataSource:MatTableDataSource<Message>;
  selection = new SelectionModel<Message>(true, []);

  subscribtions:Subscription[]=[];

  constructor(public dialog: MatDialog,private messageService:MessagesService){}
  ngOnInit() {
    if(this.msgCategory=='inbox'){
      this.displayed = ['Device Name', 'Sender', 'Messages', 'Received At'];
      this.displayedColumns = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At'];
    }
    else if(this.msgCategory=='outbox'){
      this.displayed = ['Device Name', 'Sender', 'Messages', 'Received At','Updated At','Status'];
      this.displayedColumns = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At','Updated At','Status'];
    }
    else if(this.msgCategory=='failed'){
      this.displayed = ['Device Name', 'Recipient', 'Messages', 'Received At'];
      this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At','Ation'];
    }

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
      let msgCategory=this.msgCategory;
      let search=this.messageService.search;
      this.loading = true;
      let messagesSub=this.messageService.getMessages(email,msgCategory,shows,pageNum,search).subscribe(
        (res)=>{
          this.numRows=res.length;
          this.loading = false;
          this.dataSource=new MatTableDataSource<Message>(res)

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
      let msgCategory=this.msgCategory;
      let countSub=this.messageService.getMessagesCount(email,msgCategory).subscribe(
        (res)=>{
          this.length=res;
        }
        ,(err)=>{
          this.length=0;
        }
      )
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

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSearch(event:any){
    this.messageService.search=event.value;
    this.selection.clear();
    this.getMessages();
  }

  changeColumns(event){
  //  change displayed column based on component type
  if(this.msgCategory=='failed'){
    this.displayedColumns=['select',...event,'Ation']
  }
  else{

    this.displayedColumns=['select',...event]
  }

  }

  onPageChange(event){
    this.messageService.display=event.pageSize;
    this.messageService.pageNum=event.pageIndex;
    this.selection.clear();

    this.getMessages();

  }
  displayMessage(row){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='100%';
    // dialogConfig.minWidth='200px';
    dialogConfig.disableClose = true;
    dialogConfig.position = { right: '2px'};
    dialogConfig.direction ="ltr";
    dialogConfig.data=row;
    const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });

  }
  ngOnDestroy(){
    this.subscribtions.map(e=>e.unsubscribe());
  }
}


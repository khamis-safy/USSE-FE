import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MessagesService } from '../../messages.service';
import { FormControl } from '@angular/forms';
import { Message } from '../../message';
import { Subscription } from 'rxjs';

// export interface PeriodicElement {
//   deviceName: string;
//   sender: string;
//   messages: string;
//   receivedAt: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},
//   {deviceName: 'John Smith', sender: '0121000', messages: 'Lorem Ipsum is a dummy text for the...', receivedAt: '16/6/23, 8.00pm'},

// ];

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit ,OnDestroy {

  length:number=0;
  numRows;
  loading:boolean=false;

  @Output() isChecked = new EventEmitter<Message[]>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;

  columns :FormControl;
  displayed: string[] = ['Device Name', 'Sender', 'Messages', 'Received At'];
  displayedColumns: string[] = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At'];
  dataSource:MatTableDataSource<Message>;
  selection = new SelectionModel<Message>(true, []);

  subscribtions:Subscription[]=[];

  constructor(private messageService:MessagesService){}
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
      let msgCategory=this.messageService.msgCategory;
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
      let msgCategory=this.messageService.msgCategory;
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
    this.getMessages();
  }

  changeColumns(event){
  //  change displayed column based on component type
  this.displayedColumns=['select',...event]

  }

  onPageChange(event){
    this.messageService.display=event.pageSize;
    this.messageService.pageNum=event.pageIndex;
    this.getMessages();

  }
  ngOnDestroy(){
    this.subscribtions.map(e=>e.unsubscribe());
  }
}


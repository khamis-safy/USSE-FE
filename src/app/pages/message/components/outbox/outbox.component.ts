import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  deviceName: string;
  sender: string;
  messages:string [];
  createdAt: string;
  updatedAt:string ;
  status:string ;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {deviceName: 'John Smith', sender: '0121000',  messages: ['Lorem Ipsum is a dummy text for the...' ,'document' ], createdAt: '16/6/23, 8.00pm' , updatedAt: '16/6/23, 8.00pm' , status :'sent'},
  {deviceName: 'John Smith', sender: '0121000', messages: ['Lorem Ipsum is a dummy text for the...' ,'' ], createdAt: '16/6/23, 8.00pm' , updatedAt: '16/6/23, 8.00pm' , status :'delivered'},
  {deviceName: 'John Smith', sender: '0121000', messages: ['Lorem Ipsum is a dummy text for the...' ,'image' ], createdAt: '16/6/23, 8.00pm' , updatedAt: '16/6/23, 8.00pm' , status :'pending'},
  {deviceName: 'John Smith', sender: '0121000', messages: ['Lorem Ipsum is a dummy text for the...' ,'' ],createdAt: '16/6/23, 8.00pm' , updatedAt: '16/6/23, 8.00pm' , status :'read'},
 

];

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements AfterViewInit  {
  displayedColumns: string[] = ['select' ,'deviceName', 'sender', 'messages', 'createdAt' , 'updatedAt' , 'status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
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
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }
}






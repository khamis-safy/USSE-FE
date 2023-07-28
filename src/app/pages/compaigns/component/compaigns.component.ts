import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
  status: string;
  creatorName: string;
  startDate: string;
  action:string[];
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'John Smith', status: 'ended', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'active', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'ended', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'active', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'ended', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'active', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'active', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'ended', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},
  {name: 'John Smith', status: 'active', creatorName: 'John Smith', startDate: 'May 4, 2024, 10:35 AM' , action:['','']},

];

@Component({
  selector: 'app-compaigns',
  templateUrl: './compaigns.component.html',
  styleUrls: ['./compaigns.component.scss']
})
export class CompaignsComponent implements AfterViewInit  {
  displayedColumns: string[] = ['name', 'status', 'creatorName', 'startDate' , 'action'];
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


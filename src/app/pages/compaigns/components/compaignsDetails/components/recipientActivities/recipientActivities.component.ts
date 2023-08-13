import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
  mobileNumber: string;
  name: string;
  replies: string;
  responseTime: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },
  { mobileNumber: '24 May 2023', name: 'John Smith', replies: 'Lorem Ipsum', responseTime: 'N/A' },

];

@Component({
  selector: 'app-recipientActivities',
  templateUrl: './recipientActivities.component.html',
  styleUrls: ['./recipientActivities.component.scss']
})
export class RecipientActivitiesComponent implements AfterViewInit {
  displayedColumns: string[] = ['mobileNumber', 'name', 'replies', 'responseTime'];
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


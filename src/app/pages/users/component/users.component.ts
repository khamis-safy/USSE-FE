import { Component, OnDestroy, OnInit ,ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { ActionComponent } from '../components/action/action.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface PeriodicElement {
    userIDEmail: string;
    userName: string;
    createdAt: string;
    action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' },
    { userIDEmail: 'John Smith@yahoo.com', userName: 'John Smith', createdAt: '24 May 2023', action: '' }

];
@Component({

    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    standalone: true,
    imports: [MatTableModule,MatPaginatorModule, MatCheckboxModule, MatSelectModule],
})
export class UsersComponent {
    length: number;
    numRows;
    loading; 
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    

    constructor(public dialog: MatDialog){};

    displayedColumns: string[] = ['select', 'userIDEmail', 'userName', 'createdAt', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

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
    checkboxLabel(row?: PeriodicElement) {
        //     if (!row) {
        //         return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        //     }
        //    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    openEditModal(data?) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.height = '78vh';
        dialogConfig.width = '42vw';
        dialogConfig.maxWidth = '100%';
        dialogConfig.minWidth = '300px';
        dialogConfig.maxHeight = '85vh';
        dialogConfig.disableClose = true;

        //  dialogConfig.data= {contacts:data,listDetails:false};
        const dialogRef = this.dialog.open(ActionComponent,dialogConfig);
        //this.selection.clear();
        //dialogRef.afterClosed().subscribe(result => {
        //if(result){
        //this.getContacts();
        //  }


        //});



    }

    onSearch(event: any) {
        // this.listService.search=event.value;
        // this.selection.clear();

        // this.getContacts();
    }

    changeColumns(event) {
        // if(this.isCanceled){
        //   this.displayedColumns=['select',...event]

        // }
        // else{
        //   this.displayedColumns=['select',...event,'action']
        // }

    }

    onPageChange(event) {
        // this.listService.display=event.pageSize;
        // this.listService.pageNum=event.pageIndex;
        // this.selection.clear();

        // this.getContacts();

    }
}
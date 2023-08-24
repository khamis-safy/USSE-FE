import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddUserComponent } from '../components/addUser/addUser.component';
import { ActionComponent } from '../components/action/action.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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


})

export class UsersComponent implements OnInit ,OnDestroy{
    ngOnInit() {};
    
    length: number;
    numRows;
    loading;
    @ViewChild(MatPaginator) paginator!: MatPaginator;


    constructor(public dialog: MatDialog ) { };

    displayedColumns: string[] = ['userIDEmail', 'userName', 'createdAt', 'action'];
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


    openActionModal(data?) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.height = '81vh';
        dialogConfig.width = '45vw';
        dialogConfig.maxWidth = '100%';
        dialogConfig.minWidth = '300px';
        dialogConfig.maxHeight = '87vh';
        dialogConfig.disableClose = true;

        //  dialogConfig.data= {contacts:data,listDetails:false};
        const dialogRef = this.dialog.open(ActionComponent, dialogConfig);
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


    openAddUserModal(data?) {
            const dialogConfig=new MatDialogConfig();
            dialogConfig.height = '81vh';
            dialogConfig.width = '45vw';
            dialogConfig.maxWidth = '100%';
            dialogConfig.minWidth = '300px';
            dialogConfig.maxHeight = '87vh';
            dialogConfig.disableClose = true;
        
            const dialogRef = this.dialog.open(AddUserComponent,dialogConfig);
        
            // dialogRef.afterClosed().subscribe(result => {
            //   if(result){
            //     this.contacts.getContacts();
            //   }
            // });
          

    }

    ngOnDestroy(){};
}
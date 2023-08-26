import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddUserComponent } from '../components/addUser/addUser.component';
import { ActionComponent } from '../components/action/action.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from '../users.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

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

    noData: boolean=false;
    notFound: boolean=false;
    length: number;
    numRows;
    loading;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    columns :FormControl;
    displayed: string[] = ['User Email','User Name', 'Created At'];
    displayedColumns: string[] = ['User Email','User Name', 'Created At',"Action"];
    dataSource:MatTableDataSource<any>;

    constructor(public dialog: MatDialog ,
      private toaster: ToasterServices,
      private authService:AuthService,
      private userService:UsersService
      ) { };


    ngOnInit() {

      this.columns=new FormControl(this.displayedColumns)
      let user=this.authService.userInfo();
      const email=user.email;
      console.log("email",email)
    };

    getUsers(){
      let shows=this.userService.display;
      let pageNum=this.userService.pageNum;
      let orderedBy=this.userService.orderedBy;
      let search=this.userService.search;
      let token=this.userService.token;

      this.loading = true;



      this.userService.listCustomersUsers(token,shows,pageNum,orderedBy,search).subscribe(
         (res)=>{
          this.loading = false;

            this.numRows=res.length;
      this.dataSource=new MatTableDataSource<any>(res);
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
            this.UsersCount();

          }
          },
          (err)=>{
            this.loading = false;
            this.length=0

          }
          )

    }

    UsersCount(){
      // let email=this.listService.email;

      // let sub1= this.listService.ListsCount(email).subscribe(
      //    (res)=>{
      //      this.length=res;
      //      // this.length=0;
      //      if(this.length==0){
      //        this.noData=true
      //      }
      //      else{
      //        this.noData=false
      //      }

      //    }
      //    ,(err)=>{
      //      this.length=0;}
      //  );
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

// Messages_(DeviceID) | ReadOnly-FullAccess-None
// Campaigns_(DeviceID) | ReadOnly-FullAccess-None

// Templates | ReadOnly-FullAccess-None
// Bots | ReadOnly-FullAccess-None
// Devices | ReadOnly-FullAccess-None
// Contacts | ReadOnly-FullAccess-None

// Examples:

// Messages_device1 | ReadOnly
// Messages_device2 | FullAccess
// Campaigns_device1| ReadOnly
// Templates | ReadOnly
// Devices | FullAccess

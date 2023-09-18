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
import { Users } from '../users';
import { EditUserComponent } from '../components/editUser/editUser.component';
import { TranslateService } from '@ngx-translate/core';
import { USERSHEADERS } from '../constants/constants';



@Component({

    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],


})

export class UsersComponent implements OnInit ,OnDestroy{
  isSearch:boolean=false;

    noData: boolean=true;
    notFound: boolean=false;
    length: number=0;
    numRows;
    loading;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    columns :FormControl;
    displayed: string[] = USERSHEADERS ;
    displayedColumns: string[] = ['User Email','User Name', 'Created At',"Action"];
    dataSource:MatTableDataSource<Users>;

    constructor(public dialog: MatDialog ,
      private toaster: ToasterServices,
      private authService:AuthService,
      private translate: TranslateService,

      private userService:UsersService
      ) { };


    ngOnInit() {

      this.columns=new FormControl(this.displayedColumns)
     this.getUsers();


    };

    getUsers(){
      let shows=this.userService.display;
      let pageNum=this.userService.pageNum;
      let orderedBy=this.userService.orderedBy;
      let search=this.userService.search;
      let token=this.userService.token;

      this.loading = true;
console.log("from user component",token)


      this.userService.listCustomersUsers(token,shows,pageNum,orderedBy,search).subscribe(
        (res)=>{
          this.loading = false;
          this.dataSource=new MatTableDataSource<Users>(res);

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
            this.isSearch=false;


          }
          console.log(res)

        },
        (err)=>{
         this.loading = false;
         this.length=0;

        }


          )

    }

    UsersCount(){
      let token=this.userService.token;

      this.userService.listCustomersUsersCount(token).subscribe(
        (res)=>{

          this.length=res;
          if(this.length==0){
            this.noData=true
          }
          else{
            this.noData=false
          }
        }
        ,(err)=>{
          this.noData=true

          this.length=0;
        }
       );
    }
    openActionModal(data?) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.height = '81vh';
        dialogConfig.width = '45vw';
        dialogConfig.maxWidth = '100%';
        dialogConfig.minWidth = '300px';
        dialogConfig.maxHeight = '87vh';
        dialogConfig.disableClose = true;
        dialogConfig.data=data;

        const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.getUsers();
          }
        });



    }

    onSearch(event: any) {
        this.userService.search=event.value;

        this.getUsers();
    }

    changeColumns(event) {
      this.displayedColumns=[...event,'Action']

    }

    onPageChange(event) {
        this.userService.display=event.pageSize;
        this.userService.pageNum=event.pageIndex;

        this.getUsers();

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
            dialogRef.afterClosed().subscribe(result => {
              if(result){
                this.getUsers();
              }
            });



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

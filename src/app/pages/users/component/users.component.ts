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
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({

    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],


})

export class UsersComponent implements OnInit ,OnDestroy{
  isSearch:boolean=false;

    noData: boolean=false;
    notFound: boolean=false;
    length: number=0;
    numRows;
    loading :boolean=true;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    columns :FormControl;
    displayed: string[] = USERSHEADERS ;
    displayedColumns: string[] = ['User Email','User Name', 'Created At',"Action"];
    dataSource:MatTableDataSource<Users>;

    constructor(public dialog: MatDialog ,
      private toaster: ToasterServices,
      private authService:AuthService,
      private translate: TranslateService,
      private snackBar: MatSnackBar,

      private userService:UsersService
      ) { };


    ngOnInit() {

      this.columns=new FormControl(this.displayedColumns)
     this.getUsers();


    };

    getUsers(searchVal?){
      let shows=this.userService.display;
      let pageNum=searchVal ? 0: this.userService.pageNum;
      let orderedBy=this.userService.orderedBy;
      let search=searchVal?searchVal:"";
      let token=this.userService.token;

      this.loading = true;
      if(searchVal && this.paginator){
        this.paginator.pageIndex=0
      }

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
            if(this.paginator){
              this.paginator.pageIndex=this.userService.pageNum
            }

            this.UsersCount();
            this.isSearch=false;


          }

        },
        (err)=>{
          this.loading = false;
          this.length=0;
          this.noData=true;
        }


          )

    }

    UsersCount(){
      let token=this.userService.token;
      this.loading = true;
      this.userService.listCustomersUsersCount(token).subscribe(
        (res)=>{
          this.length=res;
          this.loading = false;
          if( this.length==0){
            this.noData=true;
          }
          else{
            this.noData=false;
          }
          },
          (err)=>{
            this.loading = false;
            this.length=0;
            this.noData=true;
          })
    }
    openActionModal(data?) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.height = '81vh';
        dialogConfig.width = '45vw';
        dialogConfig.maxWidth = '100%';
        dialogConfig.minWidth = '300px';
        dialogConfig.maxHeight = '87vh';
        dialogConfig.disableClose = true;
        dialogConfig.panelClass='custom-dialog-user-actions'
        dialogConfig.data=data;

        const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.getUsers();
          }
        });



    }

    onSearch(event: any) {

        this.getUsers(event.value);
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
            dialogConfig.panelClass='custom-dialog-user-actions'


            const dialogRef = this.dialog.open(AddUserComponent,dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
              if(result){
                this.getUsers();
              }
            });



    }
    openSnackBar(customerEmail,userEmail){
      let message = this.translate.instant("One user removed");
      let action =this.translate.instant("Undo")
      let snackBarRef=this.snackBar.open(message,action,{duration:4000});
      snackBarRef.onAction().subscribe(()=>{
        this.undoDelete(customerEmail,userEmail);
      })
    }
    undoDelete(customerEmail,userEmail){
      
      this.userService.unDeleteUser(customerEmail,userEmail).subscribe(
        (res)=>{
          this.getUsers()

        }
      )
  
    }
    deleteUser(element){
      const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data =
    {
      users:{userEmail:element.email,customerEmail:this.userService.email}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.openSnackBar(this.userService.email,element.email)
        this.getUsers()
      }
    });
    }
    ngOnDestroy(){
      this.userService.display=10;
      this.userService.pageNum=0;
      this.userService.orderedBy='';
      this.userService.search='';
    };
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

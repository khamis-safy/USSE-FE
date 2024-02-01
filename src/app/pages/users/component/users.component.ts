import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddUserComponent } from '../components/addUser/addUser.component';
import { ActionComponent } from '../components/action/action.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from '../users.service';
import { Users } from '../users';
import { EditUserComponent } from '../components/editUser/editUser.component';
import { TranslateService } from '@ngx-translate/core';
import { USERSHEADERS } from '../constants/constants';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';



@Component({

  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],


})

export class UsersComponent implements OnInit, OnDestroy {
  isSearch: boolean = false;

  noData: boolean ;
  notFound: boolean = false;
  length: number = 0;
  numRows;
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  columns: FormControl;
  displayed: string[] = USERSHEADERS;
  displayedColumns: string[] = ['User Email', 'User Name', 'Created At', "Action"];
  dataSource: MatTableDataSource<Users>;

  showsOptions: SelectOption[] = [
    { title: '10', value: 10 },
    { title: '50', value: 50 },
    { title: '100', value: 100 }


  ];
  showsSelectedOptions: any = new FormControl([]);

  displayForm = new FormGroup({
    showsSelectedOptions: this.showsSelectedOptions,

  });
  accordionData:any=[]
  selectedSortingName: string = 'name';
  selectedSortingType: string = 'ASC'
  orderedBy: string = '';
  topSortingOptions: any = [{ opitonName: 'name', lable: `${this.translate.instant('nameLabel')}`, isSelected: true }
    , { opitonName: 'createdAt', lable: `${this.translate.instant('CREATE_AT')}`, isSelected: false }]

  bottomSortingOptions: any = [{ opitonName: 'ASC', lable: `${this.translate.instant('ASCENDING')}`, isSelected: true },
  { opitonName: 'DEC', lable: `${this.translate.instant('DESCENDING')}`, isSelected: false }]

  isSmallScreen: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private authService: AuthService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private userService: UsersService
  ) { };


  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)'])
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      this.isSmallScreen = result.matches;
      if(this.isSmallScreen){
        this.displayed=USERSHEADERS.filter((_, index) => index !== 1);
      }
      else{
        this.displayed=USERSHEADERS
      }
      this.getUsers();
      
    });
        this.displayForm.patchValue({
          showsSelectedOptions: {
          title:'10',
          value:10,
          }
          })
    this.columns = new FormControl(this.displayedColumns)


  };

  getUsers(searchVal?) {
    console.log(this.noData)
    let shows = this.userService.display;
    let pageNum = searchVal ? 0 : this.userService.pageNum;
    let orderedBy = this.userService.orderedBy;
    let search = searchVal ? searchVal : "";
    let token = this.userService.token;

    this.loading = true;
    if (searchVal && this.paginator) {
      this.paginator.pageIndex = 0
    }

    this.userService.listCustomersUsers(token, shows, pageNum, orderedBy, search).subscribe(
      (res) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<Users>(res);
        if(search!=""){
          this.noData=false

          this.length=res.length;
          if(this.length==0){
            this.notFound=true;

          }
          else{
            this.notFound=false;

          }
      }
      else{
        this.noData=false

        if(this.paginator)
        {
        this.paginator.pageIndex=this.userService.pageNum
        this.notFound=false;
        }
        this.UsersCount();

      }


      },
      (err) => {
        if(search!=""){
          this.noData=false
          this.notFound=true;
      }
      else{
        this.noData = true;
      }
        this.length = 0;
        this.loading = false;

      }


    )

  }

  UsersCount() {
    let token = this.userService.token;
    this.loading = true;
    this.userService.listCustomersUsersCount(token).subscribe(
      (res)=>{
        this.length=res;
        this.loading = false;
        if(this.length==0){
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
    dialogConfig.panelClass = 'custom-dialog-edit-user-actions'
    dialogConfig.data = data;

    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers();
      }
    });



  }

  onSearch(event: any) {

    this.getUsers(event.value);
  }

  changeColumns(event) {
    this.displayedColumns = [...event, 'Action']

  }
  onPageSizeChange(event) {
    this.userService.pageNum = 0;
    this.userService.display=event.value;
    if (this.paginator) {
      this.paginator.pageSize = event.value;
      this.paginator.pageIndex = 0;
    }
    this.getUsers();
  }
  
  onPageChange(event) {
    this.userService.display = event.pageSize;
    this.userService.pageNum = event.pageIndex;

    this.getUsers();

  }


  openAddUserModal(data?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '81vh';
    dialogConfig.width = '45vw';
    dialogConfig.maxWidth = '100%';
    dialogConfig.minWidth = '300px';
    dialogConfig.maxHeight = '87vh';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-dialog-add-user-actions'


    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers();
      }
    });



  }
  openSnackBar(customerEmail, userEmail) {
    let message = this.translate.instant("One user removed");
    let action = this.translate.instant("Undo")
    let snackBarRef = this.snackBar.open(message, action, { duration: 4000 });
    snackBarRef.onAction().subscribe(() => {
      this.undoDelete(customerEmail, userEmail);
    })
  }
  undoDelete(customerEmail, userEmail) {

    this.userService.unDeleteUser(customerEmail, userEmail).subscribe(
      (res) => {
        this.getUsers()

      }
    )

  }
  deleteUser(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height = '50vh';
    dialogConfig.width = '35vw';
    dialogConfig.maxWidth = '100%';
    dialogConfig.minWidth = '465px';
    dialogConfig.panelClass='custom-dialog-delete-style'

    dialogConfig.data =
    {
      users: { userEmail: element.email, customerEmail: this.userService.email }
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnackBar(this.userService.email, element.email)
        this.getUsers()
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userService.display = 10;
    this.userService.pageNum = 0;
    this.userService.orderedBy = '';
    this.userService.search = '';
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

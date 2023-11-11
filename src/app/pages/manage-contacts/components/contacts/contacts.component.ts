import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../manage-contacts.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ListData } from '../../list-data';
import { Contacts } from '../../contacts';
import { AddContactComponent } from './addContact/addContact.component';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, fromEvent, map } from 'rxjs';
import { CONTACTSHEADER } from '../../constants/constants';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { AdditonalParamsComponent } from './additonalParams/additonalParams.component';

@Component({

  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent  implements OnInit , AfterViewInit ,OnDestroy {
  length:number;
  numRows;
  loading:boolean=true;
  cellClick:boolean=false;

  @Input() isCanceled:boolean;
  @Output() isDelete = new EventEmitter<Contacts[]>;
  @Output() isChecked = new EventEmitter<Contacts[]>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef
  @ViewChild(MatSort) sort: MatSort;

@Input() canEdit:boolean;
  listTableData:ListData[]=[]
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: any[] = CONTACTSHEADER;
  displayedColumns: string[] = ['select','Name', 'Mobile',"Lists",'Additional Parameters',"Create At","action"];
  dataSource:MatTableDataSource<Contacts>;
  selection = new SelectionModel<Contacts>(true, []);
  subscribtions:Subscription[]=[];
  @Input() listId:string="";

  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  isSearch: boolean;
  noData: boolean=false;
  notFound: boolean=false;
  display: number;
  pageNum:number;

  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private authService:AuthService,
    private translationService:TranslationService
  ) {
    this.display=listService.getUpdatedDisplayNumber()
    this.pageNum=this.listService.pageNum;

    }
  ngAfterViewInit() {
  }


    @Input('isUnsubscribe') isUnsubscribe = false;

  ngOnInit() {
    if(!this.canEdit){
      this.displayedColumns = ['Name', 'Mobile',"Lists",'Additional Parameters',"Create At"];

    }

    this.getContacts();
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

  openSnackBar(){
    let message = `${this.deletedContacts.length} Item(s) Deleted`;
    let action ="Undo"
    let snackBarRef=this.snackBar.open(message,action,{duration:4000});
    snackBarRef.onAction().subscribe(()=>{
      this.undoDelete();
    })
  }
  undoDelete(){
    let email=this.authService.getUserInfo()?.email;
    this.listService.unDeleteContact(email,this.deletedContacts).subscribe(
      (res)=>{

        this.getContacts();
        this.deletedContacts=[];
        this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
      },
      (err)=>{



      }
    )

  }





  getContacts(searchVal?){
  let shows=this.listService.display;
  let email=this.authService.getUserInfo()?.email;
  let orderedBy=this.listService.orderedBy;
  let search=searchVal ? searchVal : "";
  let pageNumber=searchVal?0:this.pageNum
  if(searchVal){
    this.paginator.pageIndex=0
  }
 
  this.loading = true;

   let sub1= this.listService.getContacts(email,this.isCanceled,shows,pageNumber,orderedBy,search,this.listId).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
        if(this.isCanceled){
          this.displayedColumns= ['select','Name', 'Mobile',"Lists",'Additional Parameters',"Create At"];

        }
        res.forEach(contact => {
          contact.hideLeftArrow = true;
          contact.hideRightArrow = false;
        });
        this.dataSource=new MatTableDataSource<Contacts>(res);
        
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
        this.paginator.pageIndex=this.pageNum
        this.notFound=false;

        this.contactsCount();

      }

       },
       (err)=>{
        this.loading = false;
        this.length=0;

       })
       this.subscribtions.push(sub1)
  }


  contactsCount(){
    let email=this.authService.getUserInfo()?.email;
    this.loading=true;

    let sub2=this.listService.contactsCount(email,this.isCanceled).subscribe(

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
this.subscribtions.push(sub2)

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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSortChange(event){
    let sorting = event.active=='Name' && event.direction=='asc'?'nameASC':
                  event.active=='Name' && event.direction=='desc'?'nameDEC':

                  event.active=='Create At' && event.direction=='asc'?'createdAtASC':
                  event.active=='Create At' && event.direction=='desc'?'createdAtDEC':
                  '';
    this.listService.orderedBy=sorting;
    this.selection.clear();

    this.getContacts();


  }
  onRowClick(row:any){}

  openEditModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='88vh';
    dialogConfig.width='45vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.disableClose = true;

    dialogConfig.data= {contacts:data,listDetails:false};
    const dialogRef = this.dialog.open(AddContactComponent,dialogConfig);
    this.selection.clear();
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getContacts();
            }


    });

  }
  onPageChange(event){
    this.listService.display=event.pageSize;
    this.pageNum=event.pageIndex;
    this.listService.updateDisplayNumber(event.pageSize)
    this.selection.clear();
    this.getContacts();

  }
  onSearch(event:any){
    this.selection.clear();

    this.getContacts(event.value);
  }

  selectedRow(event){
  }
  scrollRight(element, wrapper: HTMLElement) {
    element.hideLeftArrow = false;
  element.WrapperOffsetWidth = wrapper.offsetWidth;

  // Calculate the total width of list items dynamically
  const totalListWidth = Array.from(wrapper.querySelectorAll('.listName')).reduce((acc, listItem) => {
    // Calculate the width of each list item and add it to the accumulator
    const listItemWidth = listItem.clientWidth;
    return acc + listItemWidth;
  }, 0);

  

  // Update hideRightArrow based on the scroll position
  if (this.WrapperScrollLeft > totalListWidth - element.WrapperOffsetWidth) {
    element.hideRightArrow = true;
  } else {
    element.hideRightArrow = false;
  }
  this.WrapperScrollLeft = wrapper.scrollLeft + 100;
  // Scroll to the calculated position
  wrapper.scrollTo({
    left: this.WrapperScrollLeft,
    behavior: "smooth",
  });
  }
  scrollLeft(element , wrapper){
    element.hideRightArrow = false;
    this.WrapperScrollLeft =wrapper.scrollLeft-100
    if(this.WrapperScrollLeft<=5){
      this.WrapperScrollLeft =0;
      element.hideLeftArrow=true;
      
    }
    wrapper.scrollTo({
      left: this.WrapperScrollLeft,
      behavior: "smooth",
    })
    


}
changeColumns(event){
  if(this.canEdit){

    if(this.isCanceled){
      this.displayedColumns=['select',...event]

    }
    else{
      this.displayedColumns=['select',...event,'action']
    }
  }
else{
  this.displayedColumns=[...event]

}
}
showAdditionalParams(contacts,length){
  if(!this.cellClick && length > 0){
    const currentLang=this.translationService.getCurrentLanguage()
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='100%';
    // dialogConfig.minWidth='200px';
    dialogConfig.disableClose = true;
    dialogConfig.position =  currentLang=='en'?{ right: '2px'} :{ left: '2px'} ;
    dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
    dialogConfig.data=contacts;
    const dialogRef = this.dialog.open(AdditonalParamsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });
  }
}
ngOnDestroy(){
  this.selection.clear();

  this.subscribtions.map(e=>e.unsubscribe());
}

}

import { SelectionModel } from '@angular/cdk/collections';
import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { CONTACTSHEADERMobile } from '../../../constants/constants';
import { Contacts } from '../../../contacts';
import { ListData } from '../../../list-data';
import { ManageContactsService } from '../../../manage-contacts.service';
import { AddContactComponent } from '../../contacts/addContact/addContact.component';
import { AdditonalParamsComponent } from '../../contacts/additonalParams/additonalParams.component';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { NavActionsComponent } from 'src/app/shared/components/nav-actions/nav-actions.component';
export interface ContactInfoContent {
  additionalParameters: { name: string; value: string }[];
  lists:string[];
  contactName: string;
  contactNumber: string;
  title:string;
}
@Component({
  selector: 'app-contacts-mobileView',
  templateUrl: './contacts-mobileView.component.html',
  styleUrls: ['./contacts-mobileView.component.scss']
})
export class ContactsMobileViewComponent implements OnInit {
  length:number;
  numRows;
  loading:boolean=true;
  cellClick:boolean=false;
  tableData:any=[]
  @Input() isCanceled:boolean;
  @Output() isDelete = new EventEmitter<Contacts[]>;
  @Output() selectionData = new EventEmitter<any>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef
  @ViewChild(MatSort) sort: MatSort;

@Input() canEdit:boolean;
  listTableData:ListData[]=[]
  deletedContacts:string[]=[];
  canceledContacts:string[]=[];
  columns :FormControl;
  displayed: any[] = CONTACTSHEADERMobile;
  displayedColumns: string[] = ['select','Name', 'Mobile',"Lists",'Additional Parameters',"Create At","action"];
  dataSource:MatTableDataSource<Contacts>;
  selection = new SelectionModel<Contacts>(true, []);
  subscribtions:Subscription[]=[];
  @Input() listId:string="";
  dynamicComponentRef: ComponentRef<NavActionsComponent>;

  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  isSearch: boolean;
  noData: boolean=false;
  notFound: boolean=false;
  display: number;


  showsOptions:SelectOption[]=[
    {title:'10',value:10},
    {title:'50',value:50},
    {title:'100',value:100}


  ];
  showsSelectedOptions:any = new FormControl([]);

  form = new FormGroup({
    showsSelectedOptions:this.showsSelectedOptions,
   
  });
  navActionSubscriptions:Subscription[]=[];
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  isChecked:boolean=false;
  pageIndex:number=0;

  constructor(public dialog: MatDialog,
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private authService:AuthService,
    private translationService:TranslationService,
    private drawerService: NzDrawerService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.display=listService.getUpdatedDisplayNumber()
    this.pageIndex=this.listService.pageNum;

    }
  ngAfterViewInit() {
  }


    @Input('isUnsubscribe') isUnsubscribe = false;

  ngOnInit() {
    this.form.patchValue({
      showsSelectedOptions: {
      title:String(this.listService.getUpdatedDisplayNumber()),
      value:this.listService.getUpdatedDisplayNumber(),
      

      }

      })

    if(!this.canEdit){
      this.displayedColumns = ['Name', 'Mobile',"Lists",'Additional Parameters',"Create At"];

    }

    this.getContacts();
    this.columns=new FormControl(this.displayedColumns)

    this.selection.changed.subscribe(
      (res) => {

        if(res.source.selected.length  > 0 ){
        this.isChecked=true;

        }
        else{
          this.isChecked=false;

        }
        if (this.dynamicComponentRef && res.source.selected.length  > 0 ) {
          // this.dynamicComponentRef.instance.selectedItemsCount = res.source.selected.length;
        }
      
      });

  }

  getWidth(element: HTMLElement) {

    return `${element.clientWidth}px`;
 }
  
  // Modify your existing method to handle selected row logic
  selectedRow(event: Event, element: any) {
    // Your existing selectedRow logic
  }
  selectAllRows(){
    this.selection.select(...this.tableData);
    if (this.dynamicComponentRef && this.selection.selected.length  > 0 ) {
      this.dynamicComponentRef.instance.selectedItems=this.selection.selected;
      this.dynamicComponentRef.instance.selectedItemsCount = this.selection.selected.length;
    }
  }
  createDynamicComponent(selectedContacts) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NavActionsComponent);
    this.dynamicComponentContainer.clear();
  
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    const navActionsComponentInstance: NavActionsComponent = componentRef.instance;
    navActionsComponentInstance.selectedItems = selectedContacts;
    navActionsComponentInstance.componentName =this.isCanceled? 'canceledContacts' : 'contacts';

    // Assign the componentRef to this.dynamicComponentRef
    this.dynamicComponentRef = componentRef;
  
    // Pass selected row data to the dynamic component
    let sub1 = navActionsComponentInstance.selectAllEvent.subscribe(() => {
      // Logic to handle "Select All" event
      this.selectAllRows();
    });
    let sub2 = navActionsComponentInstance.deselectAllEvent.subscribe((res) => {
     if(res){
      this.distroyDynamicComponent();
      // this.selectionData.emit(this.selection);
    }
    });
    let sub3 =  navActionsComponentInstance.updateData.subscribe((res) => {
      if(res){
        this.distroyDynamicComponent();
        this.getContacts();
      }
    });
    this.navActionSubscriptions.push(sub1,sub2,sub3)

  }
distroyDynamicComponent(){
  this.selection.clear();
  this.dynamicComponentContainer.clear();
  this.dynamicComponentRef = null;
  this.navActionSubscriptions.map((sub)=>sub.unsubscribe());
}
onCheckboxChange(event,element: any) {
  if(event.checked == false && this.dynamicComponentRef){
    this.dynamicComponentRef.instance.showContactsMenueItems();
  }
  if(this.selection.selected.length  > 0 && !this.dynamicComponentRef){
    this.createDynamicComponent(this.selection.selected);
    this.dynamicComponentRef.instance.selectedItemsCount = this.selection.selected.length;

    // this.selectionData.emit(this.selection);

  }
  else if(this.selection.selected.length  === 0 && this.dynamicComponentRef){
    this.distroyDynamicComponent()

    // this.selectionData.emit(this.selection);
  }
  if (this.dynamicComponentRef && this.selection.selected.length  > 0 ) {
    this.dynamicComponentRef.instance.selectedItems=this.selection.selected;
    this.dynamicComponentRef.instance.selectedItemsCount = this.selection.selected.length;
  }
}
unCancelSnackBar(){
  let message = `${this.canceledContacts.length} ${this.translate.instant('Item(s) UnCanceled')}`;
  let action =this.translate.instant("Undo")
  let snackBarRef=this.snackBar.open(message,action,{duration:4000});
  snackBarRef.onAction().subscribe(()=>{
    this.cancelContacts();

  })
}
  openSnackBar(){
    let message = `${this.deletedContacts.length} ${this.translate.instant('Item(s) Deleted')}`;
    let action =this.translate.instant("Undo")
    let snackBarRef=this.snackBar.open(message,action,{duration:4000});
    snackBarRef.onAction().subscribe(()=>{
      this.undoDelete();
    })
  }
  cancelContacts(){
    let email=this.authService.getUserInfo()?.email;
    this.listService.cancelContacts(email,this.canceledContacts).subscribe(
      (res)=>{

        this.getContacts("",true);
        this.canceledContacts=[];
        this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));
      },
      (err)=>{



      }
    )
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



  onSelect(event){
    this.listService.display=event.value;
    this.listService.updateDisplayNumber(event.value)
    this.pageIndex=0; 
    
    this.paginator.pageSize = event.value;
    this.paginator.pageIndex=0;
    this.getContacts();

  }

  getContacts(searchVal? ,canceled?){
  let shows=this.listService.display;
  let email=this.authService.getUserInfo()?.email;
  let orderedBy=this.listService.orderedBy;
  let search=searchVal ? searchVal : "";
  let pageNumber=searchVal?0:this.pageIndex
  if(searchVal && this.paginator){
      this.paginator.pageIndex=0
  }
 let isCanceledContacts=canceled? canceled :this.isCanceled
  this.loading = true;

   let sub1= this.listService.getContacts(email,isCanceledContacts,shows,pageNumber,orderedBy,search,this.listId).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
        if(isCanceledContacts){
          this.displayedColumns= ['select','Name', 'Mobile',"Lists",'Additional Parameters',"Create At"];

        }
        res.forEach(contact => {
          contact.hideLeftArrow = true;
          contact.hideRightArrow = false;
        });
        this.dataSource=new MatTableDataSource<Contacts>(res);
        this.tableData=res;
        this.tableData.forEach(element => {
      element.defaultExpanded = true; // Set to true or false based on your logic
    });
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
        this.paginator.pageIndex=this.pageIndex
        this.notFound=false;

        this.contactsCount(isCanceledContacts);

      }

       },
       (err)=>{
        this.loading = false;
        this.length=0;

       })
       this.subscribtions.push(sub1)
  }


  contactsCount(isCancel){
    let email=this.authService.getUserInfo()?.email;
    this.loading=true;

    let sub2=this.listService.contactsCount(email,isCancel).subscribe(

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
    dialogConfig.minWidth='833px';
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
    this.pageIndex=event.pageIndex;
    this.selection.clear();
    this.getContacts();

  }
  changePageSize(pageSize){

  }
  onSearch(event:any){
    this.selection.clear();

    this.getContacts(event.value);
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
showLists(element:Contacts){
  if(element.lists && element.lists?.length > 0){
    let listNames=element.lists.map((list)=>list.name)
    const placement = 'bottom'; // Set the placement to 'bottom' for bottom-to-top transition

    const drawerRef = this.drawerService.create<ContactInfoComponent, ContactInfoContent>({
      nzHeight: '40vh',
      nzWidth:'100vw',
      nzClosable: true,
      nzContent: ContactInfoComponent,
      nzPlacement: placement,
      nzWrapClassName: 'bottom-drawer',
      nzContentParams: {
        lists: listNames,
        contactName: element.name,
        contactNumber: element.mobileNumber,
        title:"LISTS"
      }
    });
  }

}
showAdditionalParameters(element:Contacts){
  if(element.additionalContactParameter && element.additionalContactParameter?.length > 0){
    const placement = 'bottom'; // Set the placement to 'bottom' for bottom-to-top transition

    const drawerRef = this.drawerService.create<ContactInfoComponent, ContactInfoContent>({
      nzHeight: '40vh',
      nzWidth:'100vw',
      nzClosable: true,
      nzContent: ContactInfoComponent,
      nzPlacement: placement,
      nzWrapClassName: 'bottom-drawer',
      nzContentParams: {
        additionalParameters: element.additionalContactParameter,
        contactName: element.name,
        contactNumber: element.mobileNumber,
        title:"Additional Parameters"
      }
    });
  }

}

ngOnDestroy(){
  this.selection.clear();

  this.subscribtions.map(e=>e.unsubscribe());
}

}

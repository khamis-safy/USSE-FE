import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { AddTemplateComponent } from '../../components/addTemplate/addTemplate.component';
import { TEMPLATESHEADERS } from '../../components/constats/contstants';
import { Templates } from '../../templates';
import { TemplatesService } from '../../templates.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DisplayMessageComponent } from 'src/app/pages/messages/Components/display-message/display-message.component';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-templates-mobileView',
  templateUrl: './templates-mobileView.component.html',
  styleUrls: ['./templates-mobileView.component.scss']
})
export class TemplatesMobileViewComponent implements OnInit ,OnDestroy{
  length: number;
  delay: number = 5;
  active: boolean = false;
  numRows;
  loading:boolean=true;
  isSearch:boolean=false;
  pageIndex:number=0;

    noData: boolean;
    notFound: boolean;
  @Input() isCanceled: boolean;
  @Input() canEdit: boolean;

  subscribtions:Subscription[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('search') search!: ElementRef;
  subscriptions:Subscription[]=[]
  columns: FormControl;
  display: number;
  displayed: string[] = TEMPLATESHEADERS.slice(1);
  displayedColumns: string[] = [
    'Template Name',
    'Message',
    'Created At',
    'Action',
  ];
  templatesTableData:any=[];
  dataSource: MatTableDataSource<Templates>;
  showsOptions:SelectOption[]=[
    {title:'10',value:10},
    {title:'50',value:50},
    {title:'100',value:100}


  ];
  showsSelectedOptions:any = new FormControl([]);

  form = new FormGroup({
    showsSelectedOptions:this.showsSelectedOptions,
   
  });
  openedDialogs:any=[];
  selectedSortingName: string = 'name';
  selectedSortingType: string = 'ASC'
  orderedBy: string = '';
  topSortingOptions: any = [{ opitonName: 'name', lable: `${this.translate.instant('nameLabel')}`, isSelected: true }
    , { opitonName: 'createdAt', lable: `${this.translate.instant('CREATE_AT')}`, isSelected: false }]

  bottomSortingOptions: any = [{ opitonName: 'ASC', lable: `${this.translate.instant('ASCENDING')}`, isSelected: true },
  { opitonName: 'DEC', lable: `${this.translate.instant('DESCENDING')}`, isSelected: false }]

  constructor(
    public dialog: MatDialog,
    private toaster: ToasterServices,
    private templatesService: TemplatesService,
    private translationService:TranslationService,
    private translate: TranslateService,
  ) {
    this.display=templatesService.showsNum
    this.pageIndex=templatesService.pageNum;
  }



  ngOnInit() {
    this.form.patchValue({
      showsSelectedOptions: {
      title:String(this.templatesService.showsNum),
      value:this.templatesService.showsNum,
      }
      })

    this.getTemplates();
    this.columns = new FormControl(this.displayedColumns);
    this.displayedColumns=this.canEdit?[
      'Template Name',
      'Message',
      'Created At',
      'Action',
    ]: ['Template Name', 'Message', 'Created At'];

  }

  displayMessage(row){
    const currentLang=this.translationService.getCurrentLanguage()
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='60vh';
    dialogConfig.width='100vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='100%';
    dialogConfig.disableClose = true;
    dialogConfig.position = { bottom: '0'} ;
    dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
    dialogConfig.panelClass ='bottom-to-top-dialog';

    dialogConfig.data={template:row};

    const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });
  this.openedDialogs.push(dialogRef)
  }
  openDeleteModal(id:string){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='42vh';
    dialogConfig.width='90vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='80%';
    dialogConfig.minHeight='428';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.data =
    {
      templatesData:{templatesId:id}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    let sub = dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTemplates();
      }
    });
    this.subscriptions.push(sub)
    this.openedDialogs.push(dialogRef)
  }






  openAddOrEditModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='75vh';
    dialogConfig.width='90vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='80%';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    if(data){
      dialogConfig.data=data ;
    }

    const dialogRef = this.dialog.open(AddTemplateComponent,dialogConfig);
    let sub = dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTemplates();
      }
    });
    this.subscriptions.push(sub)
    this.openedDialogs.push(dialogRef)
  }


  getTemplates(searchVal?){
        let showsNum=this.templatesService.showsNum;
        let pageNum= searchVal?0:this.pageIndex
        let email=this.templatesService.email;
        let orderedBy=this.templatesService.orderedBy;
        let search=searchVal?searchVal:"";
        this.loading = true;
        if(searchVal && this.paginator){
          this.paginator.pageIndex=0
        }
         let sub1= this.templatesService.getTemplates(email,showsNum,pageNum,orderedBy,search).subscribe(
            (res)=>{
              this.numRows=res.length;
              this.templatesTableData=res
              if(this.isCanceled){
                this.displayedColumns= ['Template Name', 'Message', "Create At" , 'Action'];

              }
              if(search!=""){
                this.length=res.length;
                this.loading = false;
                if(this.length==0){
                  this.notFound=true;
                }
                else{
                  this.notFound=false;
                }
            }
            else{
              if(this.paginator){
                this.paginator.pageIndex=this.pageIndex
              }
              this.notFound=false;
      
              this.templatesCount();
      
            }
             },
             (err)=>{
              this.loading = false;
              this.length=0;
      
            })
             this.subscribtions.push(sub1)
        }


        templatesCount(){
          let email=this.templatesService.email;
          this.loading = true;

          this.templatesService.listTemplatesCount(email).subscribe(
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




     onSearch(event: any) {

    this.getTemplates( event.value);
  }



  changeColumns(event) {
    if(this.canEdit){
      this.displayedColumns = [ ...event, 'Action'];

    }
    else{
      this.displayedColumns = [ ...event];

    }
  }
  onPageSizeChange(event){
    this.templatesService.showsNum=event.value;
    this.pageIndex=0; 
    if(this.paginator){
      this.paginator.pageSize = event.value;
      this.paginator.pageIndex=0;
    }
    
    this.getTemplates();

  }

  onPageChange(event){
    this.pageIndex=event.pageIndex;

    this.getTemplates();

  }
  ngOnDestroy() {
    this.openedDialogs.forEach((dialog)=>{
      if(dialog){
        dialog.close();
      }
    })
  this.subscriptions.map((sub)=>sub.unsubscribe())
  }
}

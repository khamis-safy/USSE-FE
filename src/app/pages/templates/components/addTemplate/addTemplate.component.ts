import {
  Component,
  OnChanges,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  Inject,
  SimpleChanges,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatesService } from '../../templates.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Templates } from '../../templates';
import { SelectionModel } from '@angular/cdk/collections';
import { WriteMessageComponent } from 'src/app/pages/messages/Components/new-message/write-message/write-message.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

export interface files {
  name: string;
  type: string;
  url: string;
  size: number;
}

@Component({
  selector: 'app-addTemplate',
  templateUrl: './addTemplate.component.html',
  styleUrls: ['./addTemplate.component.scss'],
})
export class AddTemplateComponent implements OnInit {
  isLoading = false;
  fileData: files[] = [];
  loading:boolean;
  email:string=this.templatesService.email;
  templateName: any = new FormControl('', [Validators.required]);
  messageBody: any = new FormControl('');
  attachments: any = new FormControl('');
  form = new FormGroup({
    templateName: this.templateName,
    messageBody: this.messageBody,
    attachments: this.attachments,
  });
  isEdit;

  constructor(
    private templatesService: TemplatesService,
    @Inject(MAT_DIALOG_DATA) public data: Templates,
    public dialogRef: MatDialogRef<AddTemplateComponent>,
    private translate: TranslateService,

    private toaster: ToasterServices
  ) {}

  ngOnInit() {
    if (this.data) {
      console.log(this.data);
      this.isEdit = true;
      this.fillingData();
    } else {
      this.isEdit = false;
      this.loading=false;
    }
  }

  submitAdd() {
    this.isLoading = true;
    let email = this.email;
    let templateName = this.form.value.templateName;
    let messageBody = this.form.value.messageBody;
    let attachments = this.fileData.map((file) => file.url);

    console.log('add');
    this.templatesService
      .addTemplate(templateName, messageBody, email, attachments)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.onClose(true);
                  this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

        },
        (err) => {
          this.isLoading = false;
          this.onClose(false);
        }
      );
  }

  submitEdit() {
    let email = this.email;
    let templateName = this.form.value.templateName;
    let messageBody = this.form.value.messageBody;
    let attachments = this.fileData.map((file) => file.url);
    this.isLoading = true;

    console.log(templateName);
    this.templatesService
      .updateTemplate(
        this.data.id,
        templateName,
        messageBody,
        email,
        attachments
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.onClose(true);
                  this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

        },
        (err) => {
          this.isLoading = false;
          this.onClose(false);
        }
      );
  }

  fillingData() {
    this.form.patchValue({
      templateName: this.data.templateName,
      messageBody: this.data.messageBody,
      attachments: this.data.attachments,
    });
 // attachment
 this.loading=true;
 this.templatesService.getTemplateById(this.data.id).subscribe(
  (res)=>{
    this.loading=false;
      let attachments=res.result.attachments;
      // console.log("attachment",attachments)
    this.fileData=attachments.map((attach)=>{
      let size=this.templatesService.calculateFileSizeInKB(attach.base64);
      let type = this.templatesService.extractTypeFromBase64(attach.base64)
      return{
        name:attach.fileName,
        type:type,
        url:attach.base64,
        size:size
      }
    })
    console.log(this.fileData)
  },
  (err)=>{
    this.loading=false;

  }
)
  }


  onClose(data?): void {
    this.dialogRef.close(data);
  }
  test(event){
console.log("file data",this.fileData)
  }
}

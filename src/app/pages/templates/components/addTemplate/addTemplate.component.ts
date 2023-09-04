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
  messageBody: any = new FormControl('', [Validators.required]);
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
          this.toaster.success('Success');
        },
        (err) => {
          this.isLoading = false;
          this.onClose(false);
          this.toaster.error(`Error`);
        }
      );
  }

  submitEdit() {
    let email = this.email;
    let templateName = this.form.value.templateName;
    let messageBody = this.form.value.messageBody;
    let attachments = this.form.value.attachments;
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
          this.toaster.success('Success');
        },
        (err) => {
          this.isLoading = false;
          this.onClose(false);
          this.toaster.error(`Error`);
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
      return{
        name:"",
        type:"",
        url:attach,
        size:0
      }
    })
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

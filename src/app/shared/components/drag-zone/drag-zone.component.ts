import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { uploadObject } from './drag-zone.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PreviewComponent } from './modals/preview/preview.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectComponent } from '../select/component/select.component';

const VALUE_ACCESSOR_CONFIG = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DragZoneComponent),
  multi: true,
};

@Component({
  selector: 'us-upload',
  templateUrl: './drag-zone.component.html',
  styleUrls: ['./drag-zone.component.scss'],
  providers: [VALUE_ACCESSOR_CONFIG],
})
export class DragZoneComponent implements OnInit {
  constructor(public dialog: MatDialog,) { }
  private _value!: any;
   filesList: any = [];
   isTouched = false; // to handle on touched only once

  @Input() isDisabled?: boolean; // force disable dropdown
  @Input("label") label ="Select a file or drag and drop here";
  @Input("fileSize") fileSize =10;
  @Input("fileType") fileType ="";
  @Input('data') set value(value) {
    this._value = value;

  }
  get value() {
    return this._value;
  }
  @Output() onFileChange = new EventEmitter();

  onChange = (value: any) => {}; // to register value accessor method onChange
  onTouched = () => {}; // to register value accessor method onTouched
  // Value Accessor Methods
  writeValue(value: any): void {
    if (!value) this._value = null
    else this._value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleTouched(): void {
    if (this.isTouched) this.onTouched();
  }

  ngOnInit(): void {

  }
  isLoading = false;
  toBase64(file){
    this.isLoading= true
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
  });
  }
  async  onChangeFile(e){
    e.preventDefault();
    this.isTouched= true;
    let toBase64String:any = '';
    let file:any;
    if(e?.dataTransfer?.files[0]){
      toBase64String =await this.toBase64(e.dataTransfer.files[0])
      file= e.dataTransfer.files[0]
    }else if(e?.target?.files[0]){
      toBase64String =await this.toBase64(e.target.files[0])
      file= e.target.files[0]
    }
    this.filesList.push(
      {
        name:file.name,
        type:file.type,
        url:toBase64String,
        size:file.size
      }
    )
    this.onChange(this.filesList);
    this.handleTouched();
    this.onFileChange.emit(toBase64String)
    this.isLoading= false
  }

  test(e){
    e.preventDefault();
  }
  openPreviewModal(url){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='80vh';
    dialogConfig.width='80vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='80vw';
    dialogConfig.maxHeight='80vh';
    dialogConfig.disableClose = true;
    dialogConfig.data= url;
    this.dialog.open(PreviewComponent,dialogConfig);
  }

  // @Output() imageUrl = new EventEmitter();
  // @Output() onFileUpload = new EventEmitter();
  // @Output() onFileChange = new EventEmitter();

  // fileName: any;
  // fileSize: any;
  // uploading = false;
  // progress: number = 0;
  // uploadingCompleted = false;
  // uploadingStatus = false;
  // hasImg = false;
  // subscription: any;
  // startingObject: any;
  // retryObjecct: any;

  // ngOnInit(): void {
  //   if (!this.typeObject.imgUrl) {
  //     this.typeObject.imgUrl =
  //       'https://sary-dev-cdn.s3.eu-west-1.amazonaws.com/upload.svg';
  //   } else {
  //     this.startingObject = JSON.parse(JSON.stringify(this.typeObject));
  //     this.hasImg = true;
  //     var fileName = this.typeObject.imgUrl.substring(
  //       this.typeObject.imgUrl.lastIndexOf('/') + 1,
  //       this.typeObject.imgUrl.length
  //     );
  //     this.typeObject.title = fileName;
  //   }
  // }

  // resetValue(e: any) {
  //   e.target.value = null;
  // }

  // stopUploading() {
  //   this.subscription.unsubscribe();
  //   this.reset();
  // }

  // retry() {
  //   this.uploadImage(this.retryObjecct);
  // }

  // uploadImage(e: any) {
  //   this.reset();
  //   this.retryObjecct = e;
  //   this.startingObject = JSON.parse(JSON.stringify(this.typeObject));

  //   this.uploading = true;
  //   this.typeObject.subTitle = 'Uploading....';
  //   if (e.target.files) {
  //     var file = e.target.files[0];
  //     this.fileName = file.name;
  //     this.fileSize = this.formatFileSize(file.size);
  //     var data = new FormData();
  //     this.typeObject.title = file.name;
  //     if (this.typeObject.type == 'image') {
  //       data.append('image', e.target.files[0], e.target.files[0].name);
  //     } else if (
  //       this.typeObject.type == 'file' ||
  //       this.typeObject.type == 'csv'
  //     ) {
  //       data.append('file', e.target.files[0], e.target.files[0].name);
  //     }
  //     if (this.typeObject.uploadFolder) {
  //       data.append('type', this.typeObject.uploadFolder);
  //     }

  //     if (!this.typeObject.uploadApi) {
  //       this.uploadingCompleted = true;
  //       this.uploadingStatus = true;
  //       this.uploading = false;
  //       this.typeObject.subTitle = ' Successfully Uploaded.';
  //       if (this.typeObject.type == 'image') {
  //         const reader = new FileReader();
  //         reader.onload = (e: any) => {
  //           this.typeObject.imgUrl = e.target.result;
  //         };
  //         reader.readAsDataURL(file);
  //       }

  //       this.onFileChange.emit(file);
  //     } else {
  //       const urlConfig = {
  //         api: this.typeObject.uploadApi,
  //         token: this.typeObject.token,
  //       };

  //       this.subscription = this.services.uploadImg(urlConfig, data).subscribe({
  //         next: (event: HttpEvent<any>) => {
  //           switch (event.type) {
  //             case HttpEventType.UploadProgress:
  //               this.progress = Math.round(
  //                 (event.loaded / (event.total ? event.total : 0)) * 100
  //               );

  //               break;
  //             case HttpEventType.Response:
  //               this.uploadingCompleted = true;
  //               this.uploading = false;
  //               this.onFileUpload.emit(event.body);
  //               this.uploadingStatus = event.body.status;
  //               if (this.uploadingStatus == true) {
  //                 this.typeObject.subTitle = ' Successfully Uploaded.';
  //                 this.typeObject.imgUrl = event.body.result.file;
  //                 this.imageUrl.emit(event.body.result.file);
  //               }
  //               break;
  //           }
  //         },
  //         error: (err) => {
  //           //use this on handle error from backend
  //           setTimeout(() => {
  //             this.onFileUpload.emit(err);
  //             this.uploadingStatus = false;
  //             this.uploadingCompleted = true;
  //             this.uploading = false;
  //             this.typeObject.imgUrl =
  //               'https://sary-dev-cdn.s3.eu-west-1.amazonaws.com/2022-10-31%2017%3A07%3A44469073.svg';
  //             this.typeObject.subTitle = ' Upload failed.';
  //             this.subscription.unsubscribe();
  //           }, 6000);
  //         },
  //       });
  //     }
  //   }
  // }

  // reset() {
  //   this.uploading = false;
  //   this.uploadingCompleted = false;
  //   this.uploadingStatus = false;
  //   this.hasImg = false;
  //   this.progress = 0;
  //   if (this.startingObject) {
  //     this.typeObject = this.startingObject;
  //   }
  //   this.typeObject.imgUrl =
  //     'https://sary-dev-cdn.s3.eu-west-1.amazonaws.com/upload.svg';
  //     this.onFileUpload.emit(' ');
  //   }

  // formatFileSize(bytes: number, decimalPoint = 2) {
  //   if (bytes == 0) return '0 Bytes';
  //   var k = 1000,
  //     dm = decimalPoint || 2,
  //     sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  //     i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  // }

  // ngOnDestroy() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }
}

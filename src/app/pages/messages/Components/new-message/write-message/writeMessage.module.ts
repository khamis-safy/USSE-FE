import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragZoneModule } from 'src/app/shared/components/drag-zone/drag-zone.module';
import { WriteMessageComponent } from './write-message.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DragZoneModule

],

declarations: [


WriteMessageComponent

],
exports: [
    WriteMessageComponent
],
  providers:[
    ]
})
export class WriteMessageModule { }

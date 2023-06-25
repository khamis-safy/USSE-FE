import { LayoutOneModule } from './layout-one/layout-one.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutOneComponent } from './layout-one/layout-one.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LayoutTwoComponent } from './layout-two/layout-two.component';
import { LayoutTwoModule } from './layout-two/layout-two.module';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  exports:[
    LayoutOneModule,
    LayoutTwoModule
  ]
})
export class LayoutsModule { }

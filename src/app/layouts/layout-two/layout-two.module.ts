import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutTwoComponent } from './layout-two.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutTwoRoutes } from './layout-two.routing';
import { NavModule } from 'src/app/shared/components/nav/nav.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NavModule,
    LayoutTwoRoutes
  ],
  declarations: [LayoutTwoComponent]
})
export class LayoutTwoModule { }

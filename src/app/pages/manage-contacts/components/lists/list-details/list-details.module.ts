import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LisDetailsRoutes } from './lis-details.routing';
import { ListDetailsComponent } from './component/list-details.component';

@NgModule({
  imports: [
    CommonModule,
    LisDetailsRoutes
  ],
  declarations: [ListDetailsComponent]
})
export class ListDetailsModule { }

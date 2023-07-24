import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { DynamicTooltipComponent } from './dynamic-tooltip/dynamic-tooltip.component';



@NgModule({
  declarations: [
    TooltipComponent,
    DynamicTooltipComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TooltipComponent
  ]
})
export class TooltipModule { }

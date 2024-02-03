import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { DynamicTooltipComponent } from './dynamic-tooltip/dynamic-tooltip.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    TooltipComponent,
    DynamicTooltipComponent,
    
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    TooltipComponent
  ]
})
export class TooltipModule { }

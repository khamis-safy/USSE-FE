import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';
import { FormsModule } from '@angular/forms';
import { TagModule } from '../tag/tag.module';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { RadioButtonModule } from '../radio-button/radio-button.module';
import { SelectComponent } from './component/select.component';
import { DynamicRendererComponent } from './component/dynamic-renderer/dynamic-renderer.component';
import { TooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [SelectComponent, SearchPipe, DynamicRendererComponent],
  imports: [
    CommonModule,
    FormsModule,
    TagModule,
    CheckboxModule,
    RadioButtonModule,
    TooltipModule,
  ],
  exports: [SelectComponent, SearchPipe],
})
export class SelectModule {}

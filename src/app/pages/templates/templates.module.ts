import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates/templates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplatesService } from './templates.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [TemplatesComponent],
  providers:[TemplatesService]

})
export class TemplatesModule { }

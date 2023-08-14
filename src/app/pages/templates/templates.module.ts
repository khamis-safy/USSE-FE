import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './component/templates.component';
import { TemplatesRoutes } from './templates.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplatesService } from './templates.service';
import { AddTemplateComponent } from './components/addTemplate/addTemplate.component';
import { InnerTemplatesComponent } from './components/innerTemplates/innerTemplates.component';
import { OwaTemplatesComponent } from './components/owaTemplates/owaTemplates.component';

@NgModule({
  imports: [
    CommonModule,
    TemplatesRoutes,
    SharedModule
  ],
  declarations: [
    TemplatesComponent,
    AddTemplateComponent ,
    InnerTemplatesComponent ,
    OwaTemplatesComponent
  ],
  providers:[TemplatesService]
})
export class TemplatesModule { }

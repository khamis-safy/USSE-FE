import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfoRoutes } from './info.routing';
import { InfoService } from './info.service';
import { ViewSubscriptionsComponent } from './components/viewSubscriptions/viewSubscriptions.component';
import { InfoComponent } from './component/info/info.component';

@NgModule({
  imports: [
    CommonModule,
    InfoRoutes,
    SharedModule
  ],
  declarations: [
    InfoComponent,
  ViewSubscriptionsComponent
  ],
  providers:[InfoService]
})
export class InfoModule { }

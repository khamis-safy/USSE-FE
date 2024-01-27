import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaignsDetailsRoutes } from './compaignsDetails.routing';
import { CompaignsDetailsService } from './compaignsDetails.service';

import { CompaignsDetailsComponent } from './component/compaignsDetails.component';

import { RecipientActivitiesComponent } from './components/recipientActivities/recipientActivities.component';
import { ReportSummaryComponent } from './components/reportSummary/reportSummary.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  imports: [
    CommonModule,
    CompaignsDetailsRoutes,
    SharedModule,
    MatDividerModule
  ],
  declarations: [
    CompaignsDetailsComponent ,
    RecipientActivitiesComponent ,
    ReportSummaryComponent

  ],
  providers:[CompaignsDetailsService]
})
export class CompaignsDetailsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotComponent } from './component/bot/bot.component';
import { AutomationComponent } from './components/automation/automation.component';
import { BotService } from './bot.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BotRoutes } from './bot.routing';
import { NewAutomationComponent } from './components/new-automation/new-automation.component';
import { DetailsComponent } from './components/new-automation/steps/details/details.component';
import { AutomationNameComponent } from './components/new-automation/steps/automation-name/automation-name.component';
import { ActionsModule } from '../compaigns/components/addCompaigns/campaign actions/actions.module';
import { AutomationActionComponent } from './components/automationAction/automationAction.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  imports: [
    CommonModule,
    BotRoutes,
    SharedModule,
    DragDropModule,
    ActionsModule
  ],
  declarations: [
 BotComponent,
 AutomationComponent,
 NewAutomationComponent,
 DetailsComponent,
 AutomationNameComponent,
 AutomationActionComponent


  ],
  providers:[
    BotService
    ]
})
export class BotModule { }

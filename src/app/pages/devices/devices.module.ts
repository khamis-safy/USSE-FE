import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesComponent } from './component/devices.component';
import { DevicesRoutes } from './devices.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesService } from './devices.service';
import { StepsComponent } from './components/steps/steps.component';
import { AddDeviceComponent } from './components/addDevice/addDevice.component';
import { AddTLDeviceComponent } from './components/telegramDevice/addTLDevice/addTLDevice.component';
import { AddTLStepsComponent } from './components/telegramDevice/addTLDevice/addTLSteps/addTLSteps.component';

@NgModule({
  imports: [
    CommonModule,
    DevicesRoutes,
    SharedModule
  ],
  declarations: [
    DevicesComponent,
    StepsComponent,
    AddDeviceComponent,
    AddTLDeviceComponent,
    AddTLStepsComponent
  ],
  providers:[DevicesService]
})
export class DevicesModule { }

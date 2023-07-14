import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesComponent } from './component/devices.component';
import { DevicesRoutes } from './devices.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesService } from './devices.service';

@NgModule({
  imports: [
    CommonModule,
    DevicesRoutes,
    SharedModule
  ],
  declarations: [DevicesComponent],
  providers:[DevicesService]
})
export class DevicesModule { }

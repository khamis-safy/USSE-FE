import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { SharedModule } from '../../shared.module';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import { SidenavComponent } from 'src/app/pages/sidenav/sidenav.component';


@NgModule({
  declarations: [	
    NavComponent,	
    SidenavComponent,
    
   ],
  imports: [
    CommonModule,
    SharedModule,
    NzDrawerModule

  ],
  exports: [
    NavComponent
  ],
})
export class NavModule {}

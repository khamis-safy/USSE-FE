import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SideBarComponent } from './component/side-bar.component';
import { SettingComponent } from './components/setting/setting.component';


@NgModule({
  declarations: [SideBarComponent , SettingComponent],
  imports: [
    CommonModule
  
  ],
  exports: [],
})
export class SelectModule {}

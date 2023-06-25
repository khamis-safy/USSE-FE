import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutOneComponent } from './layout-one.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthComponent } from 'src/app/pages/auth/login/auth.component';
import { SignupComponent } from 'src/app/pages/signup/component/signup.component';
import { SignupModule } from 'src/app/pages/signup/signup.module';
import { LayoutOneRoutes } from './layout-one.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutOneRoutes,
  ],
  declarations: [
    LayoutOneComponent
  ],
  exports:[LayoutOneComponent]
})
export class LayoutOneModule { }

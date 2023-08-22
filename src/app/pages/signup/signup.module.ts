import { SharedModule } from './../../shared/shared.module';
import { SignupComponent } from './component/signup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import { SignupService } from './signup.service';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,

    SharedModule
  ],
  declarations: [SignupComponent]
  ,
  providers:[SignupService]
})
export class SignupModule { }

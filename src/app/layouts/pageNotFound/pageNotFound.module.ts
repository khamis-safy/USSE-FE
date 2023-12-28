import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './pageNotFound.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageNotFoundRoutes } from './pageNotFound.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PageNotFoundRoutes
  ],
  declarations: [PageNotFoundComponent]
})
export class PageNotFoundModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './pageNotFound.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageNotFoundRoutes } from './pageNotFound.routing';
import { NavModule } from 'src/app/shared/components/nav/nav.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NavModule,
    PageNotFoundRoutes
  ],
  declarations: [PageNotFoundComponent]
})
export class PageNotFoundModule { }

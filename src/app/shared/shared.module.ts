import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { UsButtonComponent } from './components/us-button/us-button.component';
import { UsButtonDirective } from '../directives/us-button.directive';
import { ToasterServices } from './components/us-toaster/us-toaster.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InputComponent } from './components/text-input/text-input.component';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { RadioButtonModule } from './components/radio-button/radio-button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { TagModule } from './components/tag/tag.module';
import { SelectModule } from './components/select/select.module';
import { HttpClientModule } from '@angular/common/http';

// import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    FormsModule,
    NgxIntlTelInputModule,
    MatProgressSpinnerModule,
    TagModule,
    CheckboxModule,
    RadioButtonModule,
    TooltipModule,
    SelectModule,
    HttpClientModule

  ],
  declarations: [
    SideBarComponent,
    FooterComponent,
    HeaderComponent,
    UsButtonComponent,
    InputComponent,
    NavComponent,
    ToasterServices,
    UsButtonDirective,

  ],
  exports:[
    SideBarComponent,
    FooterComponent,
    HeaderComponent,
    UsButtonComponent,
    InputComponent,
    SelectModule,
    ToasterServices,
    NavComponent,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    MatIconModule,
    UsButtonDirective,
    FormsModule,
    NgxIntlTelInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers:[ToasterServices]
})
export class SharedModule { }

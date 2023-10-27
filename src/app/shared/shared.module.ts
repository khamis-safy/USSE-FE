import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SettingComponent } from './components/side-bar/components/setting/setting.component';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import {MatStepperModule} from '@angular/material/stepper';

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

import { ToasterServices } from './components/us-toaster/us-toaster.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InputComponent } from './components/text-input/text-input.component';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { RadioButtonModule } from './components/radio-button/radio-button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { TagModule } from './components/tag/tag.module';
import { SelectModule } from './components/select/select.module';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { DragZoneModule } from './components/drag-zone/drag-zone.module';
import { WriteMessageComponent } from '../pages/messages/Components/new-message/write-message/write-message.component';
import { NbTimepickerModule, NbDatepickerModule, NbToggleModule } from '@nebular/theme';

import { ToLocalTimePipe } from './pipes/toLocalTime.pipe';
import { SideBarComponent } from './components/side-bar/component/side-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptorService } from '../interceptors/error-interceptor.service';
import { ClickOutsideDirective } from './directives/clickOutside.directive';
import { ConfirmLogOutComponent } from './components/side-bar/components/confirmLogOut/confirmLogOut.component';

export const TRANSLATE_SERVICE = new InjectionToken<TranslateService>('TRANSLATE_SERVICE');

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
    MatStepperModule,
    FormsModule,
    NgxIntlTelInputModule,
    MatProgressSpinnerModule,
    TagModule,
    CheckboxModule,
    RadioButtonModule,
    TooltipModule,
    SelectModule,
    MatExpansionModule,
    DragZoneModule,
    NbTimepickerModule,
    NbDatepickerModule,
    TranslateModule

  ],
  declarations: [
    SideBarComponent,
    SettingComponent ,
    FooterComponent,
    ToLocalTimePipe,
    HeaderComponent,
    InputComponent,
    NavComponent,
    ToasterServices,
    DeleteModalComponent,
    WriteMessageComponent,
    ClickOutsideDirective,
    ConfirmLogOutComponent,
    
  ],
  exports:[
    SideBarComponent,
    FooterComponent,
    HeaderComponent,
    ToLocalTimePipe,
    InputComponent,
    SelectModule,
    ToasterServices,
    NavComponent,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatStepperModule,
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
    FormsModule,
    NgxIntlTelInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CheckboxModule,
    RadioButtonModule,
    TagModule,
    MatExpansionModule,
    DragZoneModule,
    WriteMessageComponent,
    TagModule,
    NbTimepickerModule,
    NbDatepickerModule,
    NbToggleModule,
    TranslateModule

  ],
})
export class SharedModule { }

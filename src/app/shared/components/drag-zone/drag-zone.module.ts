import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragZoneComponent } from './drag-zone.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconFromTypePipe } from './iconFromType.pipe';
import { MatIconModule } from '@angular/material/icon';
import { CalcSizePipe } from './calcSize.pipe';
import { PreviewComponent } from './modals/preview/preview.component';
import { SafeURLPipe } from '../safeURL.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [		
    DragZoneComponent,
  
    SpinnerComponent,
    IconFromTypePipe,
    CalcSizePipe,
    PreviewComponent,
    SafeURLPipe
   ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    TranslateModule
  ],
  exports: [DragZoneComponent,SpinnerComponent
  ],
})
export class DragZoneModule {}

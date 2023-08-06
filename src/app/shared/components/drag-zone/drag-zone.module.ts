import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragZoneComponent } from './drag-zone.component';
import { UsButtonComponent } from '../us-button/us-button.component';
import { UsButtonDirective } from 'src/app/directives/us-button.directive';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconFromTypePipe } from './iconFromType.pipe';
import { MatIconModule } from '@angular/material/icon';
import { CalcSizePipe } from './calcSize.pipe';
import { PreviewComponent } from './modals/preview/preview.component';
import { SafeURLPipe } from '../safeURL.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [		DragZoneComponent,UsButtonComponent,
    UsButtonDirective,
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
    FormsModule
  ],
  exports: [DragZoneComponent,UsButtonComponent,
    UsButtonDirective,SpinnerComponent
  ],
})
export class DragZoneModule {}

import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbDatepickerModule, NbTimepickerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';
import { ToasterServices } from './shared/components/us-toaster/us-toaster.component';
import { TRANSLATE_SERVICE } from './shared/shared.module';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatProgressBarModule,
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage:'en',
      loader:{
        provide:TranslateLoader,
        useFactory:createTranslateLoader,
        deps:[HttpClient]
      }
    }),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    ToasterServices,

     {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: TRANSLATE_SERVICE,
      useClass: TranslateService,
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http:HttpClient){
  return new TranslateHttpLoader(http,'./assets/i18n/','.json')
}

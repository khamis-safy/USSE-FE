import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToasterServices } from '../shared/components/us-toaster/us-toaster.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../shared/services/translation.service';
import { TRANSLATE_SERVICE } from '../shared/shared.module';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private toaster: ToasterServices,@Inject(TRANSLATE_SERVICE) private translate: TranslateService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Lazy injection of services using Injector
    // const traslate =this.injector.get(TranslationService)
    console.log('Interceptor is working'); // Add this linep rivate injector:Injector
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Check if the error is an HTTP error
        if (error instanceof HttpErrorResponse) {
          console.error('HTTP error:', error);

            // Check if 'error.error' exists before trying to access 'message'
            const errorMessage = error && error.error && this.translate.instant(error.error)? error.error  : 'COMMON.ERR';
            // Use the injected ToasterService to display the error message
            // this.toaster.error(this.translate.translateMessage(errorMessage))
            this.toaster.error(this.translate.instant(errorMessage))
          }


          // Handle the error message as needed (e.g., display it to the user)
          // For example, you can use a ToastrService or a custom error dialog
          // to display the error message.
        
        return throwError(error);
      })
    );
  }
}

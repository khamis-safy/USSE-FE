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
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private router: Router,private toaster: ToasterServices,@Inject(TRANSLATE_SERVICE) private translate: TranslateService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Check if the error is an HTTP error
        if (error instanceof HttpErrorResponse) {
          if(error.status==401){
            let localData=['email',"token"]
            localData.map((key)=>localStorage.removeItem(key));
            const expirationDate = new Date('2000-01-01'); // Set expiration date to a past date
            const removedCookie = "refreshToken" + '=; expires=' + expirationDate.toUTCString() + '; path=/';
            document.cookie = removedCookie;
            location.reload();
          }
          if(error.status!=200 && error.status!=401){

            // console.error('HTTP error:', error);
  
              // Check if 'error.error' exists before trying to access 'message'
              // Handle the error message as needed (e.g., display it to the user)
              const errorMessage = error && error.error && this.translate.instant(error.error)? error.error  : 'COMMON.ERR';
              this.toaster.error(this.translate.instant(errorMessage))
            }

          }
          return throwError(()=>error);
        
      })
    );
  }
}

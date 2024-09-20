import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const calendarInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:3001/api';

  const apiReq = req.clone({ url: `${baseUrl}${req.url}` });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      // Check if the error is an instance of HttpErrorResponse
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = error.error.message || `Server-side error: ${error.status} ${error.statusText}`;
      }

      // Log the error message
      console.error('Error:', errorMessage);

      // Rethrow the error so it can be handled by the calling service or component
      return throwError(() => new Error(errorMessage));
    })
  );
};

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.errorMessage || 'Bad Request';
              break;

            case 401:
              // Check if the error is related to account deactivation
              const errorString = JSON.stringify(error.error).toLowerCase();
              if (
                errorString.includes('deactivated') ||
                errorString.includes('you do not have access') ||
                (request.url.includes('/api/AuthControllers/ssologin') && error.status === 401)
              ) {
                errorMessage = 'Your account has been deactivated. Please contact the admin.';
                this.router.navigate(['/unauthorized'], { queryParams: { type: 'deactivated' } });
              } else {
                errorMessage = 'You do not have permission to access this resource.';
                this.router.navigate(['/unauthorized'], { queryParams: { type: 'permission' } });
              }
              break;

            case 403:
              errorMessage = 'You do not have permission to access this resource';
              break;

            case 404:
              errorMessage = error.error?.errorMessage || 'Resource not found';
              break;

            case 500:
              errorMessage = 'Internal server error';
              this.router.navigate(['/server-error']);
              break;

            case 503:
              errorMessage = 'Service temporarily unavailable';
              break;

            default:
              if (error.error?.errorMessage) {
                errorMessage = error.error.errorMessage;
              } else if (error.message) {
                errorMessage = error.message;
              }
              break;
          }
        }

        // Log the error for debugging
        console.error('Error occurred:', {
          status: error.status,
          message: errorMessage,
          error: error
        });

        // Return the error in a format that matches your backend's error structure
        return throwError(() => ({
          errorMessage: errorMessage,
          status: error.status,
          timestamp: new Date().toISOString()
        }));
      })
    );
  }
}

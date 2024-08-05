import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../shared/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {
  constructor(private authService: AuthService, private snackbar: MatSnackBar, private router: Router) { }
  maxRetry = 3;
  retryCount = 0;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('access_token');
    const sessionState:any = sessionStorage.getItem('session_state');

    if (accessToken && sessionState) {
      req = this.addToken(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
          if(error.url?.includes('refresh-token')){
            if(this.maxRetry <= this.retryCount){
              this.retryCount++;
              return EMPTY;
            }
            else if(error.error?.error?.includes('invalid_grant')){
              this.snackbar.open('Session expired, Login again', 'Ok', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 10000,
                panelClass: 'app-notification-error',
              });
              this.router.navigate(['../']);
              sessionStorage.clear();
              return EMPTY;
            }
            else{
              this.snackbar.open('Session expired, login again', 'Ok', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 10000,
                panelClass: 'app-notification-error',
              });
              this.router.navigate(['../']);
              sessionStorage.clear();
              localStorage.clear()
              return EMPTY;
            }
        }
        else {
          // !error.error.status
          if (error?.error?.msg?.includes('Invalid access token') && accessToken && sessionState) {
              return this.authService.refreshToken().pipe(
                switchMap((refreshTokenDetails: any) => {
                  sessionStorage.setItem('access_token', refreshTokenDetails.accessToken);
                  sessionStorage.setItem('session_state', refreshTokenDetails.sessionState);
                  req = this.addToken(req);
                  return next.handle(req);
                }),
                catchError((refreshError: any) => {
                  return throwError(refreshError);
                })
              );
          } else {
            return throwError(error);
          }
        }
      })
    );
  }

  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `${sessionStorage.getItem('access_token')}`,
        'session_state': `${sessionStorage.getItem('session_state')}`
      }
    });
  }
}

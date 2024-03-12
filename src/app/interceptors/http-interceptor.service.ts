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
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('access_token');
    const sessionState:any = sessionStorage.getItem('session_state');

    if (accessToken && sessionState) {
      req = this.addToken(req, accessToken, sessionState);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.error?.includes('invalid_grant')) {
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
          if (!error.error.status && accessToken) {
              return this.authService.refreshToken().pipe(
                switchMap((refreshTokenDetails: any) => {
                  sessionStorage.setItem('access_token', refreshTokenDetails.accessToken);
                  sessionStorage.setItem('session_state', refreshTokenDetails.sessionState);
                  req = this.addToken(req, refreshTokenDetails.accessToken, refreshTokenDetails.sessionState);
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

  private addToken(req: HttpRequest<any>, accessToken: string, sessionState: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `${sessionStorage.getItem('access_token')}`,
        'session_state': `${sessionStorage.getItem('session_state')}`
      }
    });
  }
}

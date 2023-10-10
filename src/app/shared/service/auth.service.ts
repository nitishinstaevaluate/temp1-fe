import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afu:any;
  authState: any;
  token:any;

  constructor ( private router: Router,private http:HttpClient) {
    // this.afu.authState.subscribe(((auth:any) =>{
    //   this.authState = auth;
    // }))
  }
  loginWithEmail(email: string, password: string) {
    const payload = {
      username:email,
      password
    }
    this.token =  this.http.post(`${environment.baseUrl}authentication/login`,payload).pipe(
      switchMap((authToken:any)=>{
        if(authToken.access_token)
          localStorage.setItem('access_token', authToken.access_token)
        return of(authToken);
      })
    );
    return this.token; 
  }

  singout(): void {
    // this.afu.signOut();
    // this.router.navigate(['/login']);
  }
}

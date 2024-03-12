import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
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
  
  // private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());

  loginWithEmail(email: string, password: string) {
    const payload = {
      userName:email,
      password
    }
    this.token =  this.http.post(`${environment.baseUrl}authentication/v2/login`,payload).pipe(
      switchMap((authToken:any)=>{
        if(authToken.access_token)
          // this.loginStatus.next(true);
          sessionStorage.setItem('access_token', authToken.access_token);
          sessionStorage.setItem('session_state', authToken.session_state);
          // localStorage.setItem('loginStatus','1')
        return of(authToken);
      })
    );
    return this.token; 
  }

  singout(): void {
    // this.afu.signOut();
    // this.router.navigate(['/login']);
  }

  // checkLoginStatus(): boolean {
  //   var loginCookie = localStorage.getItem('loginStatus');
  //   // console.log('login cookie ', loginCookie);
  //   if (loginCookie === '1') {
  //     return true;
  //   } else {
  //   return false;
  //   }
  // }

  refreshToken(){
    return this.http.get<any>(`${environment.baseUrl}authentication/refresh-token`).pipe(
      switchMap(response => {
        return of(response)
      })
    );
  }
  extractUser(){
    return this.http.get(`${environment.baseUrl}authentication/extractUser`)
  }
}

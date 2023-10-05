import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afu:any;
  authState: any;

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
    return this.http.post(`${environment.baseUrl}authentication/login`,payload)
  }

  singout(): void {
    // this.afu.signOut();
    // this.router.navigate(['/login']);
  }
}

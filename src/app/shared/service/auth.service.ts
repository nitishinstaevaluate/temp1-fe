import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afu:any;
  authState: any;

  constructor ( private router: Router) {
    // this.afu.authState.subscribe(((auth:any) =>{
    //   this.authState = auth;
    // }))
  }
  loginWithEmail(email: string, password: string) {
    return this.afu
      .signInWithEmailAndPassword(email, password)
      .then((user:any) => {
        this.authState = user;
      })
      .catch((_error:any) => {
        console.log(_error);
        throw _error;
      });
  }

  singout(): void {
    // this.afu.signOut();
    // this.router.navigate(['/login']);
  }
}

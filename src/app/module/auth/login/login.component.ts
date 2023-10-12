import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
  disabled = ""
  active:any;
  constructor(private authservice: AuthService, private router: Router, private formBuilder : FormBuilder,private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username : ['',[Validators.required, Validators.email]],
      password : ['', Validators.required]
    });
  }

  // firebase
  // email = "spruko@admin.com";
  // password = "sprukoadmin";
  errorMessage = ''; // validation _error handle
  _error: { name: string, message: string } = { name: '', message: '' }; // for firbase _error handle

  // clearErrorMessage() {
  //   this.errorMessage = '';
  //   this._error = { name: '', message: '' };
  // }

  login()
  {
    this.disabled = "btn-loading"
    // this.clearErrorMessage();
    // console.log(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
    if (this.validateForm(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)) {
      this.authservice.loginWithEmail(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe((response:any)=>{
        this.snackbar.open('Login successful','Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 4000,
          panelClass: 'app-notification-success'
        })
        this.router.navigate(['/dashboard']);
        this.disabled='';
      },
      (error:any)=>{
        this._error = error
        this.disabled = '';
          this.router.navigate(['/']);
          this.snackbar.open('Login failed, contact administrator','Ok',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: 'app-notification-error'
          })
      })
    }
  }

  validateForm(email:string, password:string) {
    if (email.length === 0) {
      this.errorMessage = "please enter email id";
      return false;
    }

    if (password.length === 0) {
      this.errorMessage = "please enter password";
      return false;
    }

    if (password.length < 6) {
      this.errorMessage = "password should be at least 6 char";
      return false;
    }

    this.errorMessage = '';
    return true;

  }
  public loginForm! : FormGroup;
  public error:any = '';

  get form(){
    return this.loginForm.controls;
  }

  // Submit(){
  //   this.disabled = "btn-loading"
  //   if (this.loginForm.controls['username'].value === "spruko@admin.com" && this.loginForm.controls['password'].value === "sprukoadmin" )
  //   {
  //     this.router.navigate(['/dashboard']);
  //   }
  //   else{
  //     this.error = "Please check email and passowrd"
  //   }
  // }
}

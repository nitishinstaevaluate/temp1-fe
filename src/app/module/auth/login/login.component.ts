import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(private authservice: AuthService, private router: Router, private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username : ['spruko@admin.com',[Validators.required, Validators.email]],
      password : ['sprukoadmin', Validators.required]
    });
  }

  // firebase
  email = "spruko@admin.com";
  password = "sprukoadmin";
  errorMessage = ''; // validation _error handle
  _error: { name: string, message: string } = { name: '', message: '' }; // for firbase _error handle

  clearErrorMessage() {
    this.errorMessage = '';
    this._error = { name: '', message: '' };
  }

  login()
  {
    this.disabled = "btn-loading"
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice.loginWithEmail(this.email, this.password)
        .then(() => {
         this.router.navigate(['/dashboard'])
        //  console.clear()
        }).catch((_error:any)=> {
          this._error = _error
          this.router.navigate(['/'])
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

  Submit(){
    this.disabled = "btn-loading"
    if (this.loginForm.controls['username'].value === "spruko@admin.com" && this.loginForm.controls['password'].value === "sprukoadmin" )
    {
      this.router.navigate(['/dashboard']);
    }
    else{
      this.error = "Please check email and passowrd"
    }
  }
}

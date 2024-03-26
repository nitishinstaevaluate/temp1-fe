import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { hasError } from 'src/app/shared/enums/errorMethods';
import authJSON from 'src/app/shared/enums/group-model-controls.json';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  authJson = authJSON.auth;
  registrationForm:any;
  hasError = hasError;
  showPassword: boolean = false;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar){}
ngOnInit() {
    this.registrationForm = this.fb.group({
      username:['', [Validators.required]],
      email:['', [Validators.required]],
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      password:['', [Validators.required]],
      confirmPassword:['', [Validators.required]]
    },{
      validators: this.passwordsMatchValidator
    })
}

clearInput(controlName:string){
  this.registrationForm.controls[controlName].setValue('');
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

submit(){
  this.userService.create(this.createUserPayload()).subscribe(
    (creationResponse)=>{
      this.snackBar.open('User has been created successfully','ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-success',
      })
  },(error)=>{
    console.log(error.error)
    if(error?.error?.error?.isEmailExisting || error?.error?.error?.errorMessage){
      this.snackBar.open('User with the provided email-id exist','ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
      })
    }
    else if(error.error?.error?.isUserNameExisting){
      this.snackBar.open('User with the provided username exist','ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
      })
    }
    else{
      this.snackBar.open(`${error.message}`,'ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
      })
    }
  })
}

createUserPayload(){
  return {
      email: this.registrationForm.value.email,
      username: this.registrationForm.value.username,
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      credentials:[
        {
          type:'password',
          value:this.registrationForm.value.password,
          temporary: false
        }
      ]
  }
}

passwordsMatchValidator(formGroup: any) {
  const password = formGroup.get('password').value;
  const confirmPassword = formGroup.get('confirmPassword').value;

  if (password !== confirmPassword) {
    formGroup.get('confirmPassword').setErrors({ mismatch: true });
  } else {
    formGroup.get('confirmPassword').setErrors(null);
  }
}
}
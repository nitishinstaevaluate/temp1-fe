import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { hasError } from 'src/app/shared/enums/errorMethods';
import authJSON from 'src/app/shared/enums/group-model-controls.json';
import { EmailService } from 'src/app/shared/service/email.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  @ViewChild('otpInput1') otpInput1!: ElementRef;
  @ViewChild('otpInput2') otpInput2!: ElementRef;
  @ViewChild('otpInput3') otpInput3!: ElementRef;
  @ViewChild('otpInput4') otpInput4!: ElementRef;
  @ViewChild('otpInput5') otpInput5!: ElementRef;
  @ViewChild('otpInput6') otpInput6!: ElementRef;
  
  authJson = authJSON.auth;
  forgetPasswordForm:any;
  hasError = hasError;
  showPassword: boolean = false;
  showOtpField = false;
  authSecret='';
  showResetPasswordForm = false;
  level = 'askEmail';
  isOtpSending = false;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private emailService: EmailService){}
ngOnInit() {
    this.forgetPasswordForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      newPassword:['', [Validators.required]],
      confirmPassword:['', [Validators.required]]
    },{
      validators: this.passwordsMatchValidator
    })
}

clearInput(controlName:string){
  this.forgetPasswordForm.controls[controlName].setValue('');
}

verifyOtp(){
  const verifyPayload = {
    authSecret: this.authSecret,
    otp: this.getOtpValue()
  }
  this.emailService.verifyOtp(verifyPayload).subscribe((otpVerificationResponse:any)=>{
    if(otpVerificationResponse){
      this.updateNavigation();
      this.showResetPasswordForm = true;
      this.snackBar.open('Otp verification success', 'Ok',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 7000,
          panelClass: 'app-notification-success',
      })
    }else{
      this.snackBar.open(`Otp verification failed, please enter correct otp`, 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
    })
    }
  },(error)=>{
      this.snackBar.open(`${error.message}`, 'Ok',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 7000,
          panelClass: 'app-notification-error',
      })
  })

}
sendOtp(){
  this.isOtpSending = true;
  const snackBarRef = this.snackBar.open('Sending Otp, please wait...', 'ok', {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: -1,
    panelClass: 'app-notification-success',
});
  this.emailService.sendOtp(this.forgetPasswordForm.value).subscribe((otpConfirmationResponse:any)=>{
    this.isOtpSending = false;
    if(otpConfirmationResponse.status){
      this.updateNavigation();
      snackBarRef.dismiss();
      this.showOtpField = true;
      this.authSecret = otpConfirmationResponse.authSecret;
      this.snackBar.open('Please check your email, we have sent otp', 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-success',
      })
    }
  },(error)=>{
    this.isOtpSending = false;
    snackBarRef.dismiss();
    if(error.error?.error?.code === 'EENVELOPE'){
      this.snackBar.open(`Please re-check your email-id, provided incorrect format`, 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
    })
    }
    else if(error.error?.error?.errorDescription?.includes('email does not exist')){
      this.snackBar.open(`Please create account first, you don't have account`, 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
    })
    }
   
    else{
      this.snackBar.open(`${error.message}`, 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 7000,
        panelClass: 'app-notification-error',
    })
    }
  })
}

backNavigation(){
  switch(this.level){
    case 'askEmail':
      this.router.navigate(['../']);
      break;
    case 'askOtp':
      this.level = 'askEmail';
      break;
    case 'askPassword':
      this.level = 'askOtp';
      break;
    default:
      this.router.navigate(['../']);
      break;
  }
}

updateNavigation(){
  switch(this.level){
    case 'askEmail':
      this.level = 'askOtp';
      break;
    case 'askOtp':
      this.level = 'askPassword';
      break;
    case 'askPassword':
      this.level = 'askPassword';
      break;
    default:
      this.router.navigate(['../']);
      break;
  }
}

moveToNextInput(event: any, nextInput: any) {
  const target = event.target as HTMLInputElement;
  if (target.value && nextInput) {
    nextInput.focus();
  }
}

moveToPreviousInput(event: any, previousInput: any) {
  const target = event.target as HTMLInputElement;
  if (!target.value && previousInput) {
    previousInput.focus();
  }
}
getOtpValue(): string {
  return `${this.otpInput1.nativeElement.value}${this.otpInput2.nativeElement.value}${this.otpInput3.nativeElement.value}${this.otpInput4.nativeElement.value}${this.otpInput5.nativeElement.value}${this.otpInput6.nativeElement.value}`;
}

passwordsMatchValidator(formGroup: any) {
  const password = formGroup.get('newPassword').value;
  const confirmPassword = formGroup.get('confirmPassword').value;

  if (password !== confirmPassword) {
    formGroup.get('confirmPassword').setErrors({ mismatch: true });
  } else {
    formGroup.get('confirmPassword').setErrors(null);
  }
}

updatePassword(){
  this.userService.resetUserPassword(this.createResetPasswordPayload()).subscribe((userResponse:any)=>{
    this.updateNavigation();
    this.snackBar.open('Password has been updated successfully', 'Ok',{
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 7000,
      panelClass: 'app-notification-success',
  })
  })
}
createResetPasswordPayload(){
  return {
    password:this.forgetPasswordForm.value.newPassword,
    email:this.forgetPasswordForm.value.email
  }
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
}
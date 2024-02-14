import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/shared/service/email.service';

@Component({
  selector: 'app-contact-sales',
  templateUrl: './contact-sales.component.html',
  styleUrls: ['./contact-sales.component.scss']
})
export class ContactSalesComponent implements OnInit{
  contactForm:any;

  constructor(private fb: FormBuilder,
    private emailService: EmailService,
    private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.loadContactFormControl()
  }


  loadContactFormControl(){
    this.contactForm = this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required]],
      mobileNumber:['',[Validators.required]],
      company:['',[Validators.required]],
      comment:['',[Validators.required]],
    })
  }
  
  submitForm() {
    if(this.contactForm.valid){
      
      this.emailService.contactSalesEmail(this.constructContactPayload()).subscribe((response:any)=>{
        if(response.status){
          this.snackBar.open('Thank you, we will reach back to you shortly', 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success'
          })
        }
        else{
          this.snackBar.open('Something went wrong, please try again', 'ok',{
            horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
          })
        }
      },(error)=>{
        this.snackBar.open('Backend error - Email trigger failed', 'ok',{
          horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error'
        })
      })
    }
    else{
      this.snackBar.open('Please fill in all contact details', 'ok',{
        horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
      })
    }
  }

  constructContactPayload(){
    return {
      name:this.contactForm.controls['name'].value,
      email:this.contactForm.controls['email'].value,
      message:this.contactForm.controls['comment'].value,
      company:this.contactForm.controls['company'].value,
      mobileNumber:this.contactForm.controls['mobileNumber'].value
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactSalesComponent } from './contact-sales/contact-sales.component';
import { MainLayoutModule } from 'src/app/layout/main-layout/main-layout.module';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    ContactSalesComponent,
    RegisterComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }

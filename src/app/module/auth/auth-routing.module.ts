import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactSalesComponent } from './contact-sales/contact-sales.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'contact-sales',
    component: ContactSalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

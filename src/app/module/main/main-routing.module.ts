import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ValutionComponent } from './valution/valution.component';

const routes: Routes = [
  {
    path : "",
    component : ValutionComponent
  },
  {
    path : "activity",
    component : ActivityComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

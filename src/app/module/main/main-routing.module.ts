import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ValuationComponent } from './valuation/valuation.component';

const routes: Routes = [
  {
    path : "",
    component : ValuationComponent
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

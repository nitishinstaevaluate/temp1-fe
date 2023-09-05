import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ValuationComponent } from './valuation/valuation.component';
import { MainValuationComponent } from './main-valuation/main-valuation.component';

const routes: Routes = [
  {
    path : "",
    component : ValuationComponent
  },
  {
    path : "activity",
    component : ActivityComponent
  },
  {
    path : "rewampvaluation",
    component : MainValuationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

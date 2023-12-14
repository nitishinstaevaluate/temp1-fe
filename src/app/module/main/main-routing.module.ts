import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ValuationComponent } from './valuation/valuation.component';
import { MainValuationComponent } from './main-valuation/main-valuation.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';

const routes: Routes = [
  // {
  //   path : "",
  //   component : ValuationComponent
  // },
  
  {
    path : "valuation",
    component : MainValuationComponent
  },
  {
    path : "panel",
    component : DashboardPanelComponent
  },
  {
    path : "activity",
    component : ActivityComponent
  },
  {
    path: '**', redirectTo: '/dashboard/panel'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

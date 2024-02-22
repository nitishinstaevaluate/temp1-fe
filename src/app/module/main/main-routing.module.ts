import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ValuationComponent } from './valuation/valuation.component';
import { MainValuationComponent } from './main-valuation/main-valuation.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { ValuationDataChecklistComponent } from './dashboard-panel/valuation-data-checklist/valuation-data-checklist.component';
import { ChecklistIdGuard } from 'src/app/shared/guard/checklist-id.guard';
import { AuthenticateUserGuard } from 'src/app/shared/guard/authenticate-user.guard';
import { MandateComponent } from './dashboard-panel/mandate/mandate.component';

const routes: Routes = [
  // {
  //   path : "",
  //   component : ValuationComponent
  // },
  
  {
    path : "valuation",
    component : MainValuationComponent,
    canActivate:[AuthenticateUserGuard]
  },
  {
    path : "panel",
    component : DashboardPanelComponent,
    canActivate:[AuthenticateUserGuard]
  },
  {
    path : "panel/data-checklist/:linkId",
    component : ValuationDataChecklistComponent,
    canActivate:[ChecklistIdGuard]
  },
  {
    path : "panel/mandate/:linkId",
    component : MandateComponent,
    canActivate:[ChecklistIdGuard]
  },
  {
    path : "activity",
    component : ActivityComponent,
    canActivate:[AuthenticateUserGuard]
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

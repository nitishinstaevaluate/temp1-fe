import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ValuationComponent } from './valuation/valuation.component';
import { ActivityComponent } from './activity/activity.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ValuationComponent,
    ActivityComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
  ]
})
export class MainModule { }

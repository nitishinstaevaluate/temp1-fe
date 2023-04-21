import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ValutionComponent } from './valution/valution.component';
import { ActivityComponent } from './activity/activity.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ValutionComponent,
    ActivityComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
  ]
})
export class MainModule { }

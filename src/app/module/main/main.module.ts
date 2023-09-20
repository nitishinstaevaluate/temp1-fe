import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ValuationComponent } from './valuation/valuation.component';
import { ActivityComponent } from './activity/activity.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MainValuationComponent } from './main-valuation/main-valuation.component';
import { GroupModelControlsComponent } from './main-valuation/group-model-controls/group-model-controls.component';
import { GroupModelReviewComponent } from './main-valuation/group-model-review/group-model-review.component';
import { GroupModelResultComponent } from './main-valuation/group-model-result/group-model-result.component';
import { ProfitLossDataComponent } from './main-valuation/group-model-review/profit-loss-data/profit-loss-data.component';
import { BalanceSheetDetailsComponent } from './main-valuation/group-model-review/balance-sheet-details/balance-sheet-details.component';
import { RelativeValuationsTableComponent } from './main-valuation/group-model-review/relative-valuations-table/relative-valuations-table.component';
import { FcfeDetailsComponent } from './main-valuation/models-details/fcfe-details/fcfe-details.component';
import { FcffDetailsComponent } from './main-valuation/models-details/fcff-details/fcff-details.component';
import { RelativeValuationDetailsComponent } from './main-valuation/models-details/relative-valuation-details/relative-valuation-details.component';
import { ValuationResultTableComponent } from './main-valuation/group-model-result/valuation-result-table/valuation-result-table.component';
import { ModelRelativeValuationResultTableComponent } from './main-valuation/group-model-result/valuation-result-table/model-relative-valuation-result-table/model-relative-valuation-result-table.component';
import { ExcessEarningDetailsComponent } from './main-valuation/models-details/excess-earning-details/excess-earning-details.component';

@NgModule({
  declarations: [ValuationComponent, ActivityComponent, MainValuationComponent, GroupModelControlsComponent, GroupModelReviewComponent, GroupModelResultComponent, ProfitLossDataComponent, BalanceSheetDetailsComponent, RelativeValuationsTableComponent,ValuationResultTableComponent, ModelRelativeValuationResultTableComponent,FcfeDetailsComponent,FcffDetailsComponent,RelativeValuationDetailsComponent, ExcessEarningDetailsComponent],
  imports: [CommonModule, MainRoutingModule, NgxDropzoneModule, SharedModule],
})
export class MainModule {}

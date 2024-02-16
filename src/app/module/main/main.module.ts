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
import { ComparableIndustriesDetailsComponent } from './main-valuation/models-details/comparable-industries-details/comparable-industries-details.component';
import { NetAssetValueDetailsComponent } from './main-valuation/models-details/net-asset-value-details/net-asset-value-details.component';
import { ReportDetailsComponent } from './main-valuation/report-details/report-details.component';
import { AssessmentDetailsComponent } from './main-valuation/group-model-review/assessment-details/assessment-details.component';
import { QuillModule } from 'ngx-quill';
import { NavbarDetailsComponent } from 'src/app/layout/main-layout/navbar-details/navbar-details.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { ScreenInputDetailsComponent } from './main-valuation/screen-input-details/screen-input-details.component';
import { ElevenUAComponent } from './main-valuation/models-details/eleven-ua/eleven-ua.component';
import { ElevenUaDetailsComponent } from './main-valuation/group-model-review/eleven-ua-details/eleven-ua-details.component';
import { ModelRuleElevenUaResultTableComponent } from './main-valuation/group-model-result/valuation-result-table/model-rule-eleven-ua-result-table/model-rule-eleven-ua-result-table.component';
import { ValuationDataChecklistComponent } from './dashboard-panel/valuation-data-checklist/valuation-data-checklist.component';

@NgModule({
  declarations: [ValuationComponent, ActivityComponent, MainValuationComponent, GroupModelControlsComponent, GroupModelReviewComponent, GroupModelResultComponent, ProfitLossDataComponent, BalanceSheetDetailsComponent, RelativeValuationsTableComponent,ValuationResultTableComponent, ModelRelativeValuationResultTableComponent,FcfeDetailsComponent,FcffDetailsComponent,RelativeValuationDetailsComponent, ExcessEarningDetailsComponent, ComparableIndustriesDetailsComponent, NetAssetValueDetailsComponent, ReportDetailsComponent, AssessmentDetailsComponent,NavbarDetailsComponent, DashboardPanelComponent, ElevenUAComponent, ElevenUaDetailsComponent, ModelRuleElevenUaResultTableComponent,ScreenInputDetailsComponent, ValuationDataChecklistComponent],
  imports: [CommonModule, MainRoutingModule, NgxDropzoneModule, SharedModule,QuillModule.forRoot(),NgxUiLoaderModule],
})
export class MainModule {}

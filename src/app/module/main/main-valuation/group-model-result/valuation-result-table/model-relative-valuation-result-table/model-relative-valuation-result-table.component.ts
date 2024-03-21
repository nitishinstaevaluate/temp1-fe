import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MODELS } from 'src/app/shared/enums/constant';
import { formatNumber, formatPositiveAndNegativeValues } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-model-relative-valuation-result-table',
  templateUrl: './model-relative-valuation-result-table.component.html',
  styleUrls: ['./model-relative-valuation-result-table.component.scss']
})
export class ModelRelativeValuationResultTableComponent implements OnChanges{
  @Input() dataSource:any;
  @Input() formData:any;
  tableResult:any='';
  formatPositiveAndNegativeNumber=formatPositiveAndNegativeValues;
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource;
    this.formData;
  }

  checkIfOnlyMarketApproach(){
    if(this.formData.formOneAndThreeData?.model?.length && 
      (
        this.formData.formOneAndThreeData?.model.includes(MODELS.RELATIVE_VALUATION) || 
        this.formData.formOneAndThreeData?.model.includes(MODELS.COMPARABLE_INDUSTRIES)
      ) 
      && this.formData.formOneAndThreeData?.model.length === 1
      ){
        return true;
      }
    return false;
  }
}
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MODELS } from 'src/app/shared/enums/constant';
import { formatNumber, formatPositiveAndNegativeValues } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';

@Component({
  selector: 'app-model-relative-valuation-result-table',
  templateUrl: './model-relative-valuation-result-table.component.html',
  styleUrls: ['./model-relative-valuation-result-table.component.scss']
})
export class ModelRelativeValuationResultTableComponent implements OnChanges, OnInit{
  @Input() dataSource:any;
  @Input() formData:any;
  tableResult:any='';
  peSelection = true;
  psSelection = true;
  pbSelection = true;
  evEbitdaSelection = true;
  serialNumber = 0;
  formatPositiveAndNegativeNumber=formatPositiveAndNegativeValues;
  constructor(private calculationService: CalculationsService){}
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource;
    this.formData;
  }
  ngOnInit(): void {
    this.calculationService.multiplesSelector.subscribe((multipleSelectData)=>{
      if(multipleSelectData){
        this.peSelection = multipleSelectData.peSelection;
        this.psSelection = multipleSelectData.psSelection;
        this.pbSelection = multipleSelectData.pbSelection;
        this.evEbitdaSelection = multipleSelectData.evEbitdaSelection;
      }
    })
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

  incrementSerialNumber(){
    return this.serialNumber++;
  }
}
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-group-model-review',
  templateUrl: './group-model-review.component.html',
  styleUrls: ['./group-model-review.component.scss']
})
export class GroupModelReviewComponent implements OnChanges {

  modelControl=groupModelControl;

  @Output() saveAndNextEvent = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<any>();
  @Output() groupReviewControls = new EventEmitter<any>();

  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;

  reviewForm:FormGroup;

  floatLabelType:any='never';
  profitLoss:any;
  balanceSheet:any;
  isLoadingBalanceSheet=true;
  isLoadingProfitLoss=true;
  betaValue:any ;
  taxRateValue:any;
  debtValue:any
  tableData:any
  valuationData: any;
  updateExcel=false;
  editedExcel:any=[];
  constructor(private valuationService:ValuationService,
    private formBuilder:FormBuilder){
    this.reviewForm=this.formBuilder.group({
      otherAdj:['',[Validators.required]],
    })

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.transferStepperTwo){
      this.betaValue=this.transferStepperTwo?.beta ? parseFloat(this.transferStepperTwo?.beta).toFixed(2) : 0;
      this.debtValue=this.transferStepperTwo?.costOfDebt ? parseFloat(this.transferStepperTwo?.costOfDebt).toFixed(2): 0;
      this.taxRateValue= this.transferStepperTwo?.taxRate ? parseFloat(this.transferStepperTwo?.taxRate).toFixed(2) : 0;
      const company = this.transferStepperTwo?.companies ? this.transferStepperTwo.companies : [];
      const industry = this.transferStepperTwo?.industries ? this.transferStepperTwo.industries : [];
      const toggleIndustryOrCompany = this.transferStepperTwo?.preferenceRatioSelect === 'Company Based' ? true : false;
      this.tableData = {company,industry,status:toggleIndustryOrCompany};
    }
  }
  saveAndNext() {
    const keysToRemove = ['status', 'industriesRatio', 'betaIndustry', 'preferenceCompanies'];

    const filteredData = Object.keys(this.transferStepperTwo).reduce((result:any, key) => {
        if (!keysToRemove.includes(key)) {
            result[key] = this.transferStepperTwo[key];
        }
        return result;
    }, {});

    const payload = {
      ...filteredData,
      otherAdj:this.reviewForm.controls['otherAdj'].value && (this.isRelativeValuation('FCFE') || this.isRelativeValuation('FCFF')) ? this.reviewForm.controls['otherAdj'].value : null,
      excelEditedData:this.editedExcel
    }
    this.valuationService.submitForm(payload).subscribe((response)=>{
      console.log(response,"output payload")
      if(response?.valuationResult){
        this.valuationData= response; 
        this.groupReviewControls.emit({PL:this.profitLoss,BL:this.balanceSheet,appData:this.valuationData})
      }
    })
    console.log(payload,"input payload")
  }

  previous(){
    this.previousPage.emit(true)
  }

  profitLossData(data:any){
    if(data){
      this.profitLoss = data.result;
      this.isLoadingProfitLoss=false;
    }
  }

  balanceSheetData(data:any){
    if(data){
      this.isLoadingBalanceSheet=false;
      this.balanceSheet = data.result;
    }
  }

  excelData(data:any){
    if(data.editedValues.length !==0){
      this.editedExcel=data
      return this.updateExcel = true;
    }
    return this.updateExcel=false;
  }

  isRelativeValuation(value:string){
    return this.transferStepperTwo?.model.includes(value) ? true :false;
  }
  isFcff(value:string){
    return this.transferStepperTwo?.model.includes(value) ? true :false;
  }
}

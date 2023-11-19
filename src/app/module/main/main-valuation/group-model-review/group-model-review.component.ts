import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
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
  @Output() previousGroupReviewControls = new EventEmitter<any>();

  @Input() transferStepperTwo :any;
  @Input() step :any;

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
  isPAndLExcelModified=false;
  isBSExcelModified=false;
  isAssessmentSheetModified=false;
  modifiedExcelSheetId='';
  isExcelModified=false
  constructor(private valuationService:ValuationService,
    private formBuilder:FormBuilder,
    private calculationService:CalculationsService){
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
      isExcelModified: localStorage.getItem('excelStat') === 'true' ? true: false,
      modifiedExcelSheetId:localStorage.getItem('excelStat') === 'true' ? `edited-${filteredData.excelSheetId}` : '' 
    }
    this.valuationService.submitForm(payload).subscribe((response)=>{
      console.log(response,"output payload")
      if(response?.valuationResult){
        this.valuationData= response; 
        this.groupReviewControls.emit({PL:this.profitLoss,BL:this.balanceSheet,appData:this.valuationData});
      }
    })
    console.log(payload,"input payload")

    if(this.isRelativeValuation('FCFE') || this.isFcff('FCFF')){

      if(this.reviewForm.controls['otherAdj'].value !== ''){
        this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
        localStorage.setItem('step',`4`);
        localStorage.setItem('stepThreeStats','true');
      }
      else{
        this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step})
        localStorage.setItem('step',`4`);
        localStorage.setItem('stepThreeStats','false');
      }
    }
    else{
      this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
        localStorage.setItem('step',`4`);
        localStorage.setItem('stepThreeStats','true');
    }
  }


  previous(){
    this.previousPage.emit(true)
  }

  profitLossData(data:any){
    if(data){
      this.profitLoss = data.result;
      this.isLoadingProfitLoss=false;
      this.isExcelModified = data.isExcelModified;
    }
  }

  balanceSheetData(data:any){
    if(data){
      this.isLoadingBalanceSheet=false;
      this.balanceSheet = data.result;
      this.isExcelModified = data.isExcelModified;
    }
  }

  assessmentSheetData(data:any){
    this.isExcelModified = data.isModified;
    this.modifiedExcelSheetId = data.modifiedExcelSheetId;
  }

  isRelativeValuation(value:string){
    return this.transferStepperTwo?.model.includes(value) ? true :false;
  }
  isFcff(value:string){
    return this.transferStepperTwo?.model.includes(value) ? true :false;
  }
  hasSingleModel(modelName:string){
    if(this.step === 3 && this.transferStepperTwo?.excelSheetId){
      return (isSelected(modelName,this.transferStepperTwo?.model) && this.transferStepperTwo.model.length <= 1)
    }
    return false;
  }
}

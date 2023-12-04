import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODELS } from 'src/app/shared/enums/constant';
@Component({
  selector: 'app-group-model-review',
  templateUrl: './group-model-review.component.html',
  styleUrls: ['./group-model-review.component.scss']
})
export class GroupModelReviewComponent implements OnChanges,OnInit {

  modelControl=groupModelControl;

  @Output() saveAndNextEvent = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<any>();
  @Output() groupReviewControls = new EventEmitter<any>();
  @Output() previousGroupReviewControls = new EventEmitter<any>();

  @Input() transferStepperTwo :any;
  @Input() step :any;
  @Input() thirdStageInput :any;

  reviewForm:FormGroup;

  hasError = hasError;
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
    private calculationService:CalculationsService,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){
    this.reviewForm=this.formBuilder.group({
      otherAdj:['',[Validators.required]],
    })

  }
  ngOnInit(): void {
    this.checkProcessExist();
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

  checkProcessExist(){
    if(this.thirdStageInput){
      const formThreeData = this.thirdStageInput.formThreeData;
      if(formThreeData){
        this.reviewForm.controls['otherAdj'].setValue(formThreeData.otherAdj);
      }
    }
  }
  saveAndNext() {
    let updatedPayload:any;
    let thirdStageData:any;
    if(!this.transferStepperTwo){
      const formOneData = this.thirdStageInput?.formOneData;
      const formTwoData = this.thirdStageInput?.formTwoData;
      formTwoData.map((formTwoDetails:any)=>{
        if(formTwoDetails.model === MODELS.FCFE && formOneData.model.includes(MODELS.FCFE)){
          const {model ,formFillingStatus, ...rest} = formTwoDetails;
          updatedPayload = {...formOneData,...rest,...updatedPayload}
        }
        if(formTwoDetails.model === MODELS.FCFF && formOneData.model.includes(MODELS.FCFF)){
          const {model ,formFillingStatus, ...rest} = formTwoDetails;
          updatedPayload = {...formOneData,...rest,...updatedPayload}
        }
        if(formTwoDetails.model === MODELS.EXCESS_EARNINGS && formOneData.model.includes(MODELS.EXCESS_EARNINGS)){
          const {model ,formFillingStatus, ...rest} = formTwoDetails;
          updatedPayload = {...formOneData,...rest,...updatedPayload}
        }
        if(formTwoDetails.model === MODELS.RELATIVE_VALUATION && formOneData.model.includes(MODELS.RELATIVE_VALUATION)){
          const {model , formFillingStatus, ...rest} = formTwoDetails;
          updatedPayload = {...formOneData,...rest,...updatedPayload}
        }
        if(formTwoDetails.model === MODELS.COMPARABLE_INDUSTRIES && formOneData.model.includes(MODELS.COMPARABLE_INDUSTRIES)){
          const {model , formFillingStatus, ...rest} = formTwoDetails;
          updatedPayload = {...formOneData,...rest,...updatedPayload}
        }
        if(formTwoDetails.model === MODELS.NAV && formOneData.model.includes(MODELS.NAV)){
          const {model , formFillingStatus, ...rest} = formTwoDetails;
          updatedPayload = {...formOneData,...rest,...updatedPayload}
        }
      })  
       const {status, industriesRatio, betaIndustry, preferenceCompanies,...rest} = updatedPayload;
       thirdStageData = rest;
    }


    const payload = {
      ...(!this.transferStepperTwo ? thirdStageData : this.transferStepperTwo ),
      otherAdj:this.reviewForm.controls['otherAdj'].value && (this.isRelativeValuation('FCFE') || this.isRelativeValuation('FCFF')) ? this.reviewForm.controls['otherAdj'].value : null,
      isExcelModified: localStorage.getItem('excelStat') === 'true' ? true: false,
      modifiedExcelSheetId:localStorage.getItem('excelStat') === 'true' ? `edited-${(!this.transferStepperTwo ? thirdStageData :  this.transferStepperTwo).excelSheetId}` : '' 
    }
   

    let processStat:any,processStatStep:any;
    if(this.isRelativeValuation('FCFE') || this.isFcff('FCFF')){

      if(this.reviewForm.controls['otherAdj'].valid){
        this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
        localStorage.setItem('step',`4`);
        localStorage.setItem('stepThreeStats','true');
        processStat = 3;
        processStatStep = true;
      }
      else{
        this.reviewForm.markAllAsTouched();
        this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step})
        localStorage.setItem('step',`4`);
        localStorage.setItem('stepThreeStats','false');
        processStat = 2;
        processStatStep = false;
      }
    }
    else{
      this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
        localStorage.setItem('step',`4`);
        localStorage.setItem('stepThreeStats','true');
        processStat = 3;
        processStatStep = true;
    }
    this.valuationService.submitForm(payload).subscribe((response)=>{
      if(response?.valuationResult){
        this.valuationData= response; 
        this.groupReviewControls.emit({appData:this.valuationData,valuationId:response.reportId});
        const processStateModel ={
          thirdStageInput:{
            appData:this.valuationData,
            otherAdj:this.reviewForm.controls['otherAdj'].value && (this.isRelativeValuation('FCFE') || this.isRelativeValuation('FCFF')) ? this.reviewForm.controls['otherAdj'].value : null,
            isExcelModified: localStorage.getItem('excelStat') === 'true' ? true: false,
            modifiedExcelSheetId:localStorage.getItem('excelStat') === 'true' ? `edited-${(!this.transferStepperTwo ? thirdStageData :  this.transferStepperTwo).excelSheetId}` : '',
            formFillingStatus:processStatStep
          },
          step:processStat
        }
        this.processStateManager(processStateModel,localStorage.getItem('processStateId'));
      }
    })
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
    if(!this.transferStepperTwo){
      return this.thirdStageInput?.formOneData?.model.includes(value)
    }
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

  processStateManager(process:any, processId:any){
    this.processStatusManagerService.instantiateProcess(process, processId).subscribe(
      (processStatusDetails: any) => {
        if (processStatusDetails.status) {
          localStorage.setItem('processStateId', processStatusDetails.processId);
        }
      },
      (error) => {
        this.snackBar.open(`${error.message}`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        });
      }
    );
  }
}

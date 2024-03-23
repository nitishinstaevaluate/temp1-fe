import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormArray, FormBuilder,FormControl,Validators } from '@angular/forms';
import { MODELS, helperText } from 'src/app/shared/enums/constant';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { hasError } from 'src/app/shared/enums/errorMethods';


@Component({
  selector: 'app-relative-valuation-details',
  templateUrl: './relative-valuation-details.component.html',
  styleUrls: ['./relative-valuation-details.component.scss']
})
export class RelativeValuationDetailsComponent implements OnInit,OnChanges {

  modelControl = groupModelControl;
  @Input() formOneData:any;
  @Input() thirdStageInput:any;
  @Output() relativeValDetailsPrev = new EventEmitter<any>();
  @Output() relativeValDetails = new EventEmitter<any>();
  @Input() formTwoData:any;
  @Input() next:any;
  companyList:any =[];
  selectedIndustry:any = '';

  relativeValuation:any;
  MODEL=MODELS;
  industries:any=[];
  meanMedianList:any = [];

  floatLabelType:any='never';
  helperText = helperText;
  hasError = hasError;
  discountRateValue:any;
  constructor(private formBuilder:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar,
    private calculationsService:CalculationsService,
    private ciqSpService: CiqSPService){}

  ngOnChanges(changes:SimpleChanges){
    this.loadFormControl();
    this.checkPreviousAndCurrentValue(changes);
  }

  isRelativeValuation(value:string){
    return this.formOneData?.model?.includes(value) ? true :false;
  }
  ngOnInit(): void {
    this.checkProcessExist();
  }

  checkProcessExist(){
    if(this.thirdStageInput){
      this.thirdStageInput.map((stateThreeDetails:any)=>{
        if(stateThreeDetails.model === MODELS.RELATIVE_VALUATION && this.formOneData.model.includes(MODELS.RELATIVE_VALUATION)){
          this.discountRateValue = stateThreeDetails.discountRateValue;
          this.relativeValuation.controls['discountRateValue'].setValue(stateThreeDetails.discountRateValue)
        }
      })
    }
  }

loadFormControl(){
    this.relativeValuation=this.formBuilder.group({
      preferenceRatioSelect:['Company Based',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([]),
      discountRateValue:['',[Validators.required]]
    })
  }

  get Companies() {
    return this.relativeValuation?.controls['companies'] as FormArray;
  }
  get Industries() {
    return this.relativeValuation?.controls['industries'] as FormArray;
  }
  removeField(i: any) {
    this.Companies.controls.splice(i, 1);
    this.relativeValuation.controls['companies'].value.splice(i,1)
  }
  addInput() {
    this.Companies.push(new FormControl(null));
  }
  removeFieldIndustry(i: any) {
   this.Industries.controls.splice(i,1)
  }
  addInputIndustry() {
    this.Industries.push(new FormControl(null));
  }

  previous(){
    this.relativeValDetailsPrev.emit({status:MODELS.RELATIVE_VALUATION})
  }


  saveAndNext(){
    localStorage.setItem('stepThreeStats','true')

    this.calculateMeanMedianRatio()
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

  checkPreviousAndCurrentValue(changes:any){

    // (If selected companies list is modified, use this code )
    // this.calculationsService.betaChangeDetector.subscribe((detector:any)=>{
    //   if(detector.status){
    //     const current = changes['formTwoData'].currentValue;
    //     // this.companyList = current.formTwoData.selectedIndustries;
    //     // this.selectedIndustry = current.formTwoData.industryL3;
    //   }
    // })
    
    if (this.formTwoData && changes['formTwoData'] ) {
      const current = changes['formTwoData'].currentValue;
      this.selectedIndustry = current.formTwoData?.industryL3
      this.companyList = current.formTwoData?.selectedIndustries
    }
  
    
    if(this.formOneData){
        const formOneData = this.formOneData;
          if(this.companyList && formOneData.model.includes(MODELS.RELATIVE_VALUATION)){
            this.Companies.controls[0]?.patchValue(this.companyList[0]);
          }
          this.companyList?.map((prefCompany:any,prefCompanyIndex:number)=>{
            this.addInput();
            this.Companies.controls[prefCompanyIndex]?.setValue(this.companyList[prefCompanyIndex]);
          })
    }
    this.relativeValuation.controls['discountRateValue'].setValue(this.discountRateValue)
      
  }

  async calculateMeanMedianRatio(){
    const payload = {
      industryAggregateList:this.relativeValuation.controls['companies'].value,
      ratioType: 'Company Based'
    }
    
    this.discountRateValue = this.relativeValuation.controls['discountRateValue'].value;
    this.ciqSpService.calculateSPCompaniesMeanMedianRatio(payload).subscribe((response:any)=>{
      if(response.status){
        this.meanMedianList = response.data 
        const processStateModel ={
          thirdStageInput:[{model:MODELS.RELATIVE_VALUATION,...this.relativeValuation.value,formFillingStatus:true, companies:this.meanMedianList}],
          step:localStorage.getItem('step')
        }
    
        this.processStateManager(processStateModel,localStorage.getItem('processStateId'));
    
        this.relativeValDetails.emit({...this.relativeValuation.value,status:MODELS.RELATIVE_VALUATION,industries:this.industries,companies:this.meanMedianList})
      }
      else{
        this.snackBar.open('mean and median calculation failed','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.snackBar.open(`mean median calculation failed ${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }
  
  clearInput(formControl:string){
    this.relativeValuation.controls[formControl].setValue('');
  }
}

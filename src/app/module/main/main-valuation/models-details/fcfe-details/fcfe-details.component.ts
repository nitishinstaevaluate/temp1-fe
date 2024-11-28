import {  AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Validators,FormBuilder,FormGroup,FormControl } from '@angular/forms';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { BETA_FROM_TYPE, BETA_SUB_TYPE, MODELS } from 'src/app/shared/enums/constant';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { convertToNumberOrZero, formatNumber } from 'src/app/shared/enums/functions';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-fcfe-details',
  templateUrl: './fcfe-details.component.html',
  styleUrls: ['./fcfe-details.component.scss']
})
export class FcfeDetailsComponent implements OnChanges,OnInit, AfterViewInit{
  @ViewChild('submenuTrigger') submenuTrigger!: MatMenuTrigger;

  modelControl:any = groupModelControl;

  @Output() fcfeDetails=new EventEmitter<any>();
  @Output() fcfeDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() thirdStageInput:any;
  @Input() formTwoData:any;
  @Input() next:any;
  @Input() sensitivityAnalysisToggle:any;
  @Input() valuePerShare:any;
  @Input() secondaryValuationId:any;

  hasError=hasError
  fcfeForm:any;
  specificRiskPremiumModalForm:any;
  otherForm:any;
  floatLabelType:any = 'never';
  discountR: any=[];
  equityM: any=[];
  rPremium:any=[];
  adjCoe:number=0;
  coe:number=0;
  apiCallMade = false;
  isLoader = false;
  riskRate:any;
  isDialogOpen = false;
  meanBeta = false;
  medianBeta = true;
  betaLoader=false;
  selectedSubBetaType:any = BETA_SUB_TYPE[0];
  stockBetaChecker = false;
  expectedMarketReturnSubOptions:any;
  disableSnsitveAnlsys = false;
  revaluationLoader = false;
  
constructor(
  private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar,
  private calculationsService:CalculationsService,
  private processStatusManagerService:ProcessStatusManagerService,
  private ciqSpService:CiqSPService){
    this.loadFormControl();
  }
  
ngOnChanges(changes:SimpleChanges): void {
  if(this.next !==1 )
    return;

  this.formOneData;
  if(!this.sensitivityAnalysisToggle){
    this.checkPreviousAndCurrentValue(changes);
  }
}

ngOnInit(): void {
  // if(this.next === 1){
    // this.loadFormControl();
    this.checkProcessExist();
    this.loadValues();
    this.loadOnChangeValue();
  // }
}
ngAfterViewInit() {
  if (this.sensitivityAnalysisToggle) {
    this.otherForm.controls['terminalGrowthRate'].patchValue(this.formOneData?.terminalGrowthRate);
  }
}
checkProcessExist(){
if(this.thirdStageInput){
  if(!this.sensitivityAnalysisToggle){
  this.thirdStageInput.map((stateTwoDetails:any)=>{
    if(stateTwoDetails.model === MODELS.FCFE && this.formOneData.model.includes(MODELS.FCFE)){
      this.fcfeForm.controls['discountRate'].setValue(stateTwoDetails?.discountRate) 
      this.fcfeForm.controls['discountingPeriod'].setValue(stateTwoDetails?.discountingPeriod)
      this.selectedSubBetaType = stateTwoDetails?.betaSubType ? stateTwoDetails.betaSubType : BETA_SUB_TYPE[0];
      this.fcfeForm.controls['coeMethod'].setValue(stateTwoDetails?.coeMethod); 
      this.fcfeForm.controls['riskFreeRate'].setValue(stateTwoDetails?.riskFreeRate); 
      this.fcfeForm.controls['riskFreeRateYears'].setValue(stateTwoDetails?.riskFreeRateYears); 
      let expectedMarketReturnData:any;
      this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
        if(response.value ===  stateTwoDetails?.expMarketReturnType){
          expectedMarketReturnData = response
        }
      })
      this.fcfeForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData?.name);
      this.fcfeForm.controls['expMarketReturnSubType'].setValue(stateTwoDetails?.expMarketReturnSubType);
      this.fcfeForm.controls['bse500Value'].setValue(stateTwoDetails?.bse500Value);
      this.fcfeForm.controls['expMarketReturn'].setValue(stateTwoDetails?.expMarketReturn);
      this.fcfeForm.controls['specificRiskPremium'].setValue(stateTwoDetails?.specificRiskPremium); 
      this.fcfeForm.controls['riskPremium'].setValue(stateTwoDetails?.riskPremium);
      this.fcfeForm.controls['industryRiskPremium'].setValue(stateTwoDetails?.industryRiskPremium);
      this.fcfeForm.controls['sizePremium'].setValue(stateTwoDetails?.sizePremium);
      this.specificRiskPremiumModalForm.controls['companySize'].setValue(stateTwoDetails?.alpha.companySize)
      this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(stateTwoDetails?.alpha.marketPosition)
      this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(stateTwoDetails?.alpha.liquidityFactor)
      this.specificRiskPremiumModalForm.controls['competition'].setValue(stateTwoDetails?.alpha.competition);
      if(!this.formOneData.companyId && stateTwoDetails.betaType === 'stock_beta'){
        this.fcfeForm.controls['betaType'].setValue('');
        this.fcfeForm.controls['beta'].reset();
      }
      else{
        this.fcfeForm.controls['betaType'].setValue(stateTwoDetails?.betaType) 
        this.fcfeForm.controls['beta'].setValue(stateTwoDetails?.beta);
      }
      this.calculateCoeAndAdjustedCoe()
    }
  })
  }
  else{
    this.fcfeForm.controls['discountRate'].setValue(this.thirdStageInput?.discountRate) 
    this.fcfeForm.controls['discountingPeriod'].setValue(this.thirdStageInput?.discountingPeriod)
    this.selectedSubBetaType = this.thirdStageInput?.betaSubType ? this.thirdStageInput.betaSubType : BETA_SUB_TYPE[0];
    this.fcfeForm.controls['coeMethod'].setValue(this.thirdStageInput?.coeMethod); 
    this.fcfeForm.controls['riskFreeRate'].setValue(this.thirdStageInput?.riskFreeRate); 
    this.fcfeForm.controls['riskFreeRateYears'].setValue(this.thirdStageInput?.riskFreeRateYears); 
    let expectedMarketReturnData:any;
    this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
      if(response.value ===  this.thirdStageInput?.expMarketReturnType){
        expectedMarketReturnData = response
      }
    })
    this.fcfeForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData?.name);
    this.fcfeForm.controls['expMarketReturnSubType'].setValue(this.thirdStageInput?.expMarketReturnSubType);
    this.fcfeForm.controls['bse500Value'].setValue(this.thirdStageInput?.bse500Value);
    this.fcfeForm.controls['expMarketReturn'].setValue(this.thirdStageInput?.expMarketReturn);
    this.fcfeForm.controls['specificRiskPremium'].setValue(this.thirdStageInput?.specificRiskPremium); 
    this.fcfeForm.controls['riskPremium'].setValue(this.thirdStageInput?.riskPremium);
    this.fcfeForm.controls['industryRiskPremium'].setValue(this.thirdStageInput?.industryRiskPremium);
    this.fcfeForm.controls['sizePremium'].setValue(this.thirdStageInput?.sizePremium);
    this.specificRiskPremiumModalForm.controls['companySize'].setValue(this.thirdStageInput?.alpha.companySize)
    this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(this.thirdStageInput?.alpha.marketPosition)
    this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(this.thirdStageInput?.alpha.liquidityFactor)
    this.specificRiskPremiumModalForm.controls['competition'].setValue(this.thirdStageInput?.alpha.competition);
    if(!this.formOneData.companyId && this.thirdStageInput.betaType === 'stock_beta'){
      this.fcfeForm.controls['betaType'].setValue('');
      this.fcfeForm.controls['beta'].reset();
    }
    else{
      this.fcfeForm.controls['betaType'].setValue(this.thirdStageInput?.betaType) 
      this.fcfeForm.controls['beta'].setValue(this.thirdStageInput?.beta);
    }
    this.calculateCoeAndAdjustedCoe()
  }
}
}

loadValues(){
    this.valuationService.getValuationDropdown()
      .subscribe((resp: any) => {
        this.discountR = resp[DROPDOWN.DISCOUNT];
        this.equityM = resp[DROPDOWN.EQUITY];
        this.rPremium = resp[DROPDOWN.PREMIUM];
      });
}

loadOnChangeValue(){

  this.fcfeForm.controls['riskFreeRateYears'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    if(val === "customRiskFreeRate"){
      const data={
        value: 'customRiskFreeRate',
        riskFreeRate: this.fcfeForm.controls['riskFreeRate'].value
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%'});
      dialogRef.afterClosed().subscribe((result)=>{
        if (result) {
          this.fcfeForm.controls['riskFreeRate'].setValue(parseFloat(result?.riskFreeRate));
          
          this.snackBar.open('Risk Free Rate Added','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success'
          })
        } else {
          this.fcfeForm.controls['riskFreeRate'].setValue('');
        }
        this.calculateCoeAndAdjustedCoe();
      })
    }
    else{
      this.calculateRiskFreeRate(val);
    }
  })

  this.fcfeForm.controls['coeMethod'].valueChanges.subscribe((value:any)=>{
    if(!value) return;

    this.fcfeForm.get('riskPremium').reset();
    this.fcfeForm.get('riskPremium').setErrors({required:true});

    this.fcfeForm.get('riskPremium').markAsTouched();
    this.calculateCoeAndAdjustedCoe();
  })  

  this.fcfeForm.controls['sizePremium'].valueChanges.subscribe((value:any)=>{
    if(!value) return;
    this.calculateCoeAndAdjustedCoe()
  })
  
  this.fcfeForm.controls['industryRiskPremium'].valueChanges.subscribe((value:any)=>{
    if(!value) return;
    this.calculateCoeAndAdjustedCoe()
  })
}

loadFormControl(){
    this.fcfeForm=this.formBuilder.group({
    discountRate:['Cost_Of_Equity',[Validators.required]],
    discountingPeriod:['',[Validators.required]],
    betaType:['',[Validators.required]],
    coeMethod:['',[Validators.required]],
    riskFreeRate:['',[Validators.required]],
    riskFreeRateYears:['',[Validators.required]],
    expMarketReturnType:['',[Validators.required]],
    expMarketReturn:['',[Validators.required]],
    specificRiskPremium:[false,[Validators.required]],
    beta:['',[Validators.required]],
    riskPremium:['',[Validators.required]],
    expMarketReturnSubType:['',[Validators.required]],
    bse500Value:['',[Validators.required]],
    industryRiskPremium:['',[Validators.required]],
    sizePremium:['',[Validators.required]]
  })

  this.specificRiskPremiumModalForm=this.formBuilder.group({
    companySize:['',[Validators.required]],
    marketPosition:['',[Validators.required]],
    liquidityFactor:['',[Validators.required]],
    competition:['',[Validators.required]],
  })

  this.otherForm = this.formBuilder.group({
    terminalGrowthRate:['', [Validators.required]]
  })
}

getDocList(doc: any) {
    return doc.type;
}
 

onSlideToggleChange(event: any) {
  if (event && !this.isDialogOpen) {
    this.isDialogOpen = true;

    const data = {
      data: {
        ...this.specificRiskPremiumModalForm.value,
        value:'specificRiskPremiumForm',
        coeMethod:this.fcfeForm.controls['coeMethod'].value
      },
    };

    const dialogRef = this.dialog.open(GenericModalBoxComponent, {data:data,width:'30%'});

    dialogRef.afterClosed().subscribe((result) => {
      this.isDialogOpen = false; // Reset the flag

      if (result) {
        this.specificRiskPremiumModalForm.patchValue(result);

        const controlNames = ['companySize', 'marketPosition', 'liquidityFactor', 'competition'];

        const summationQualitativeAnalysis = controlNames.reduce((sum, controlName) => {
          const controlValue = parseFloat(this.specificRiskPremiumModalForm.controls[controlName].value) || 0;
          return sum + controlValue;
        }, 0);

        this.fcfeForm.controls['riskPremium'].setValue(summationQualitativeAnalysis);
        this.fcfeForm.controls['riskPremium'].markAsUntouched();
        this.snackBar.open('Specific Risk Premium is added', 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success',
        });
        this.calculateCoeAndAdjustedCoe();
      } else {
        this.calculateCoeAndAdjustedCoe();
      }
    });
  }
}

saveAndNext(): void {
  let expectedMarketReturnData:any;
  this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
    if(response.name ===  this.fcfeForm.controls['expMarketReturnType'].value){
      expectedMarketReturnData = response
    }
  })

  const payload = {...this.fcfeForm.value,alpha:this.specificRiskPremiumModalForm.value,status:'FCFE'};
  payload['expMarketReturnType']=expectedMarketReturnData.value;
  payload['adjustedCostOfEquity']=this.adjCoe;
  payload['costOfEquity']=this.coe;
  payload['betaSubType']=this.selectedSubBetaType
  payload['riskFreeRate'] = +this.fcfeForm.controls['riskFreeRate'].value;

  if(this.sensitivityAnalysisToggle){
    payload['secondaryValuationId'] = this.secondaryValuationId;
    payload['terminalGrowthRate'] = this.otherForm.controls['terminalGrowthRate'].value;
  }

  const controls = {...this.fcfeForm.controls};
  if(payload.expMarketReturnType === 'Analyst_Consensus_Estimates'){
    delete controls.bse500Value;
    delete controls.expMarketReturnSubType;
  }
  if(this.fcfeForm.controls['coeMethod'].value === 'capm'){
    delete controls.industryRiskPremium;
    delete controls.sizePremium;
  }
  if(this.fcfeForm.controls['coeMethod'].value === 'buildUpCapm'){
    delete controls.beta;
    delete controls.betaType;
  }
  // validate formcontrols
  if(!this.sensitivityAnalysisToggle){
    this.validateControls(controls,payload);
  }
  else{
    this.validateControlsInCaseSnsitveAnlsys(controls,payload);
  }
}

validateControlsInCaseSnsitveAnlsys(controlArray: { [key: string]: FormControl },payload:any){
  let allControlsFilled = true;
    for (const controlName in controlArray) {
      if (controlArray.hasOwnProperty(controlName)) {
        const control = controlArray[controlName];
        if (control.value === null || control.value === '' ) {
          allControlsFilled = false;
          break;
        }
       
      }
    }
    if(!allControlsFilled) return this.disableSnsitveAnlsys = true;
    let processStateStep = 5;
    const processStateModel ={
      thirdStageInput:[{model:MODELS.FCFE,...payload,formFillingStatus:allControlsFilled}],
      step:processStateStep
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))

    this.fcfeDetails.emit(payload);
    
    return;
}

validateControls(controlArray: { [key: string]: FormControl },payload:any){
  let allControlsFilled = true;
    for (const controlName in controlArray) {
      if (controlArray.hasOwnProperty(controlName)) {
        const control = controlArray[controlName];
        if (control.value === null || control.value === '' ) {
          allControlsFilled = false;
          console.log(control,"control", controlName)
          break;
        }
       
      }
    }
    if(!allControlsFilled){
      this.fcfeForm.markAllAsTouched();
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && !formStat.includes('1')){
        localStorage.setItem('pendingStat',`${[...formStat,'1']}`)
      }
      else{
        localStorage.setItem('pendingStat',`1`)
      }
      localStorage.setItem('stepThreeStats',`false`);
    }
    else{
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && formStat.includes('1')){
        const splitFormStatus = formStat.split(',');
        splitFormStatus.splice(splitFormStatus.indexOf('1'),1);
        localStorage.setItem('pendingStat',`${splitFormStatus}`);
        if(splitFormStatus.length>1){
          localStorage.setItem('stepThreeStats',`false`);
          
        }else{
        localStorage.setItem('stepThreeStats',`true`);
        localStorage.removeItem('pendingStat');
        }
      }
      else if (formStat !== null && !formStat.includes('1')){
        localStorage.setItem('stepThreeStats',`false`);
      }
      else{
        localStorage.setItem('stepThreeStats',`true`);  
      }
    }

    let processStateStep;
    if(allControlsFilled){
      processStateStep = 3
    }
    else{
      processStateStep = 2
    }
    const processStateModel ={
      thirdStageInput:[{model:MODELS.FCFE,...payload,formFillingStatus:allControlsFilled}],
      step:processStateStep
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))

    this.fcfeDetails.emit(payload);
}

previous(){
  this.fcfeDetailsPrev.emit({status:'FCFE'})
}

calculateCoeAndAdjustedCoe() {
    
  this.isLoader=true
  const coePayload = {
    riskFreeRate: this.fcfeForm.controls['riskFreeRate'].value,
    expMarketReturn: this.fcfeForm.controls['expMarketReturn'].value,
    beta: this.fcfeForm.controls['beta']?.value ? this.fcfeForm.controls['beta'].value : 0,
    riskPremium: this.fcfeForm.controls['riskPremium'].value,
    coeMethod: this.fcfeForm.controls['coeMethod'].value,
    industryRiskPremium: this.fcfeForm.controls['industryRiskPremium'].value,
    sizePremium: this.fcfeForm.controls['sizePremium'].value
  };

  this.calculationsService.getCostOfEquity(coePayload).subscribe((response: any) => {
    if (response.status) {
      this.adjCoe = formatNumber(response?.result?.adjCOE);
      this.coe = formatNumber(response?.result?.coe);
      this.apiCallMade = true;
    }
    else{
      this.adjCoe = 0;
      this.coe = 0;
    }
    this.isLoader=false;
  });
  this.isLoader=false;
}

processStateManager(process:any, processId:any){
  this.revaluationLoader = true;
  this.processStatusManagerService.instantiateProcess(process, processId).subscribe(
    (processStatusDetails: any) => {
      if (processStatusDetails.status) {
        this.revaluationLoader = false;
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
  if (this.formOneData && changes['formOneData'] ) {
    const current = changes['formOneData'].currentValue;
    const previous = changes['formOneData'].previousValue;
    
    if((current?.valuationDate && previous?.valuationDate) && current.valuationDate !== previous.valuationDate){
      this.fcfeForm.controls['expMarketReturnType'].setValue('');
      this.fcfeForm.controls['expMarketReturn'].reset();
      this.fcfeForm.controls['betaType'].setValue('');
      this.fcfeForm.controls['beta'].reset();
      this.calculateRiskFreeRate(this.fcfeForm.controls['riskFreeRateYears'].value)
    }

    this.stockBetaCheck(current, previous);
  }
  // if(this.equityM?.length > 0){
  //   this.fcfeForm.controls['coeMethod'].setValue(this.equityM[0].type);
  // }

  this.calculationsService.betaChangeDetector.subscribe((detector:any)=>{
    if(detector.status){
      this.fcfeForm.controls['betaType'].setValue('');
      this.fcfeForm.controls['beta'].reset();
    }
  })
}

onRadioButtonChange(event:any){
    this.calculateBeta(event?.target?.value)
}

betaChange(event:any){
  const selectedValue = event.value;
  if(selectedValue){
  if(this.formTwoData?.formTwoData?.betaFrom !== BETA_FROM_TYPE.ASWATHDAMODARAN){
      if(selectedValue.includes('unlevered') || selectedValue.includes('levered')){
        this.calculateBeta(BETA_SUB_TYPE[0]);
      }
      else if(selectedValue.includes('stock_beta')){
        this.calculateStockBeta();
      }
      else if(selectedValue.includes('custom_beta')){
        this.calculateCustomBeta();
      }
      else{
        this.selectedSubBetaType = '';
        this.fcfeForm.controls['beta'].setValue(1);
        this.calculateCoeAndAdjustedCoe();
      }
    }
    else{
      const aswathDamodaranSelectedBetaObj = this.formTwoData?.formTwoData?.aswathDamodaranSelectedBetaObj;
      if(selectedValue.includes('unlevered')){
        this.fcfeForm.controls['beta'].setValue(aswathDamodaranSelectedBetaObj?.unleveredBeta);
        this.calculateCoeAndAdjustedCoe();
      }
      else if(selectedValue.includes('levered')){
        this.fcfeForm.controls['beta'].setValue(aswathDamodaranSelectedBetaObj?.beta);
        this.calculateCoeAndAdjustedCoe();
      }
      else if(selectedValue.includes('custom_beta')){
        this.calculateCustomBeta();
      }
      else{
        this.selectedSubBetaType = '';
        this.fcfeForm.controls['beta'].setValue(1);
        this.calculateCoeAndAdjustedCoe();
      }
    }
  }
}

stockBetaCheck(current:any, previous:any){
  if(this.formOneData.companyId){
    this.stockBetaChecker = true;
  }
  else{
    this.stockBetaChecker = false;
  }
  if(!current.companyId && this.fcfeForm.controls['betaType'].value === 'stock_beta'){
    this.fcfeForm.controls['betaType'].setValue('');
    this.fcfeForm.controls['beta'].reset();
  }
  else if(current.companyId && current.companyId !== previous?.companyId && this.fcfeForm.controls['betaType'].value === 'stock_beta'){
    this.calculateStockBeta();
  }
}

calculateBeta(betaSubType:any){
  const betaPayload = {
    industryAggregateList: this.formTwoData.formTwoData.selectedIndustries,
    betaSubType: betaSubType,
    taxRate: this.formOneData.taxRate || this.formTwoData.formOneData.taxRate,
    betaType: this.fcfeForm.controls['betaType'].value,
    valuationDate: this.formOneData.valuationDate || this.formTwoData.formOneData.valuationDate
  }
  this.betaLoader = true;
  this.ciqSpService.calculateSPindustryBeta(betaPayload).subscribe((betaData:any)=>{
    if(betaData.status){
      this.fcfeForm.controls['beta'].setValue(betaData.total);
      this.selectedSubBetaType = betaSubType;

      this.processStatusManagerService.fetchProcessIdentifierId(localStorage.getItem('processStateId')).subscribe(async (processManagerDetails:any)=>{
      this.betaLoader = false;
        if(processManagerDetails){
          const payload = {
            coreBetaWorking:betaData.coreBetaWorking,
            betaMeanMedianWorking: betaData.betaMeanMedianWorking,
            processIdentifierId: processManagerDetails.processIdentifierId
          }
          await this.ciqSpService.upsertBetaWorking(payload).toPromise();
        }
      },(error)=>{
        this.betaLoader = false;
        this.snackBar.open(`Beta upsertion failed`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        });
      })
      this.calculateCoeAndAdjustedCoe();
    }
    else{
      this.betaLoader = false;
      this.snackBar.open(`Beta not found`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      });
    }
  },(error)=>{
    this.betaLoader = false;
    this.snackBar.open(`Beta calculation failed, please retry`, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'app-notification-error',
    },); 
  })

}

calculateCustomBeta(){
  const data = {
    value:'customBeta',
    betaValue: this.fcfeForm.controls['beta'].value
  }
  const betaDialogPrev = this.dialog.open(GenericModalBoxComponent,{data:data, width: '30%',maxHeight: '90vh',panelClass: 'custom-dialog-container'});

  betaDialogPrev.afterClosed().subscribe((result)=>{
    if (result) {
      this.fcfeForm.controls['beta'].setValue(convertToNumberOrZero(result?.customBeta))
      this.snackBar.open('Custom beta Added','OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
    } else {
      this.fcfeForm.controls['beta'].setValue('');
      this.fcfeForm.controls['betaType'].setValue('');
      this.snackBar.open('Please add beta','OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: 'app-notification-error'
      })
    }
    this.calculateCoeAndAdjustedCoe();
  })
}

calculateRiskFreeRate(maturityYears:any){
  if(!maturityYears)
    return;
  this.calculationsService.getRiskFreeRate(maturityYears,this.formOneData.valuationDate).subscribe((response:any)=>{
    if(response.status){
      this.fcfeForm.controls['riskFreeRate'].setValue(formatNumber(response.riskFreeRate));
      this.calculateCoeAndAdjustedCoe();
    }
    else{
      this.snackBar.open('Risk Free Rate Calculation Failed', 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      })
    }
  },
  (error)=>{
    this.snackBar.open('Error in risk free rate calculation', 'Ok',{
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'app-notification-error',
    })
  })
}

calculateStockBeta(){
  this.betaLoader = true;

  const payload = {
    companyId: this.formOneData.companyId,
    valuationDate: this.formOneData?.valuationDate
  }

  this.ciqSpService.calculateStockBeta(payload).subscribe((response:any)=>{
    this.betaLoader = false;
    if(response.status){
      if(response.total){
        this.fcfeForm.controls['beta'].setValue(response.total);
      }
      if(!response.isStockBetaPositive && !response.total){
        this.fcfeForm.controls['beta'].setValue(response.negativeBeta);
      }
      if(!response.total){
        this.fcfeForm.controls['beta'].setValue(response.total);
      }
      this.calculateCoeAndAdjustedCoe();
    }
    else{
      this.snackBar.open('stock beta calculation failed', 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      })
    }
  },(error)=>{
    this.betaLoader = false;
    this.snackBar.open('backend error - stock beta calculation failed', 'Ok',{
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'app-notification-error',
    })
  }
  )
}

  loadBetaDropdown() {
    const betaDropdownValues = this.modelControl.fcfe.options.betaType.options.slice().filter((option:any) => option.enabled === true);
    const stockBetaIndex = betaDropdownValues.findIndex((element: any) => element.value === 'stock_beta');

    if (!this.stockBetaChecker) {
      if (stockBetaIndex >= 0) {
        betaDropdownValues.splice(stockBetaIndex, 1);
      }  
    } 
    else {
      if (stockBetaIndex < 0) {
        betaDropdownValues.push({ name: "Stock Beta", value: "stock_beta" });
      }
    }

    return betaDropdownValues;
  }

  clearInput(controlName:string){
    this.fcfeForm.controls[controlName].setValue('');
    this.clearRelatedControls(controlName);
  }

  clearRelatedControls(controls:any){
    switch(controls){
      case 'riskFreeRateYears':
        this.fcfeForm.controls['riskFreeRate'].setValue('');
      break;
      case 'expMarketReturnType':
        this.fcfeForm.controls['expMarketReturn'].setValue('');
        this.fcfeForm.controls['expMarketReturnSubType'].setValue('');
        this.fcfeForm.controls['bse500Value'].setValue('');
        this.expectedMarketReturnSubOptions = null;
      break;
      case 'betaType':
        this.fcfeForm.controls['beta'].setValue('');
      break;
    }
  }

  async loadBetaCalculation(){
    const processManagerDetails:any = await this.processStatusManagerService.fetchProcessIdentifierId(localStorage.getItem('processStateId')).toPromise();
    if(processManagerDetails?.processIdentifierId){
      this.ciqSpService.fetchBetaWorking(processManagerDetails?.processIdentifierId).subscribe((betaWorkingResponse:any)=>{
        if(betaWorkingResponse.status){
          const data={
            value:'betaCalculation',
            coreBetaWorking: betaWorkingResponse.data.coreBetaWorking,
            betaMeanMedianWorking: betaWorkingResponse.data.betaMeanMedianWorking
          }
          const dialogPrev = this.dialog.open(GenericModalBoxComponent,{data:data, width:'90%',maxHeight: '90vh',panelClass: 'custom-dialog-container'})
        }
        else{
          this.snackBar.open('beta working not found, try again', 'Ok',{
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 3000,
            panelClass: 'app-notification-error',
          })
        }
      },(error)=>{
        this.snackBar.open('backend error - beta working not found, try again', 'Ok',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        })
      })
    }
  }

  handleBetaClick() {
    if(this.formTwoData?.formTwoData?.betaFrom === BETA_FROM_TYPE.ASWATHDAMODARAN){
      this.snackBar.open('Workings available for Capital Iq database only', 'Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: 'app-notification-error'
      })
      return;
    }
    if (this.fcfeForm.controls['betaType'].value === 'market_beta' || this.fcfeForm.controls['betaType'].value === 'stock_beta') {
      this.snackBar.open('Workings available for relevered and unlevered beta only', 'Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: 'app-notification-error'
      })
    } else {
      this.loadBetaCalculation();
    }
  }

  expMarketReturnSubOptClicked(subOpt:any){
    const expSubOpt = subOpt;
    if (expSubOpt){
      this.fcfeForm.controls['expMarketReturnSubType'].setValue(expSubOpt?.value);
      this.calculateCagr(this.createCagrPayload(expSubOpt.years));
      this.expectedMarketReturnSubOptions = null;
    }
  }

  createCagrPayload(years:any){
    let expectedMarketReturnData:any;
      this.modelControl.fcff.options.expMarketReturnType.options.map((response:any)=>{
        if(response.name ===  this.fcfeForm.controls['expMarketReturnType'].value){
          expectedMarketReturnData = response
        }
      })

    return {
      expectedMarketReturnType: expectedMarketReturnData?.value,
      baseYrs: years, 
      valuationDate: this.formOneData?.valuationDate
    }
  }

  calculateCagr(payload:any){
    this.dataReferenceService.getCagr(payload?.baseYrs, payload?.valuationDate, payload?.expectedMarketReturnType).subscribe(
      (response) => {
        if (response.status) {
          this.fcfeForm.controls['expMarketReturn'].setValue(response?.result || 0);
          if(!response?.result){
            this.snackBar.open('Expected market return not found', 'Ok',{
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000,
              panelClass: 'app-notification-error',
            })
          }
        }
        this.fcfeForm.controls['bse500Value'].setValue(response?.close?.Close ? response?.close?.Close.toFixed(2) : 0);
        
        if(!response?.status){
          this.snackBar.open('Cannot find data for the selected base year', 'Ok',{
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: 'app-notification-error',
          })
      }
        this.calculateCoeAndAdjustedCoe();
      },
      (error) => {
        console.error(error);
        this.calculateCoeAndAdjustedCoe();
      }
    );
  }
  

  openExpMarketReturnSubType(option: any) {
    if(!option) return;

    if(option?.value === "Analyst_Consensus_Estimates"){
      const data={
        data: 'ACE',
        width:'30%',
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,data);
      dialogRef.afterClosed().subscribe((result)=>{
        if (result) {
          this.fcfeForm.controls['expMarketReturn'].patchValue(parseFloat(result?.analystConsensusEstimates))
          this.snackBar.open('Analyst Estimation Added','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success'
          })
          this.fcfeForm.controls['bse500Value'].setValue('')
        } else {
          this.fcfeForm.controls['expMarketReturnType'].setValue('');
        }
        this.submenuTrigger.closeMenu();
        this.expectedMarketReturnSubOptions = null;
        this.calculateCoeAndAdjustedCoe();
      })
    }
    else{
      if (this.submenuTrigger) {
        this.submenuTrigger.openMenu();
      }
      this.expectedMarketReturnSubOptions = option;
    }
  }

  onScroll(event:any){
    if(this.expectedMarketReturnSubOptions?.subOptions?.length && event){
      this.expectedMarketReturnSubOptions = null;
      this.submenuTrigger.closeMenu();
      this.fcfeForm.controls['expMarketReturnType'].reset();
      this.fcfeForm.controls['expMarketReturnType'].markAsTouched();
      this.fcfeForm.controls['expMarketReturn'].reset()
      this.fcfeForm.controls['bse500Value'].reset();
    }
  }
// patchFcfeDetails(){
//   const processStateId = localStorage.getItem('processStateId');
//   if(processStateId){
//     this.processStatusManagerService.retrieveProcess(processStateId).subscribe(
//       (response:any)=>{
//         if(response.status){
//           if(response.stateInfo){
//             const processStateDetails = response.stateInfo;
//             if(processStateDetails?.secondStageInput){
//               this.formFilledData = processStateDetails.secondStageInput;
//               this.formFilledData.map((stateTwoDetails:any)=>{
//                 if(stateTwoDetails.model === MODELS.FCFE && this.formOneData.model.includes(MODELS.FCFE)){
//                   this.fcfeForm.controls['discountRate'].setValue(stateTwoDetails?.discountRate) 
//                   this.fcfeForm.controls['discountingPeriod'].setValue(stateTwoDetails?.discountingPeriod) 
//                   this.fcfeForm.controls['betaType'].setValue(stateTwoDetails?.betaType) 
//                   this.fcfeForm.controls['coeMethod'].setValue(stateTwoDetails?.coeMethod); 
//                   this.fcfeForm.controls['riskFreeRate'].setValue(stateTwoDetails?.riskFreeRate); 
//                   let expectedMarketReturnData:any;
//                   this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
//                     if(response.value ===  stateTwoDetails?.expMarketReturnType){
//                       expectedMarketReturnData = response
//                     }
//                   })
//                   this.fcfeForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData.name);
//                   this.fcfeForm.controls['expMarketReturn'].setValue(stateTwoDetails?.expMarketReturn);
//                   this.fcfeForm.controls['specificRiskPremium'].setValue(stateTwoDetails?.specificRiskPremium); 
//                   this.fcfeForm.controls['beta'].setValue(stateTwoDetails?.beta);
//                   this.fcfeForm.controls['riskPremium'].setValue(stateTwoDetails?.riskPremium); 
//                   this.specificRiskPremiumModalForm.controls['companySize'].setValue(stateTwoDetails?.alpha.companySize)
//                   this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(stateTwoDetails?.alpha.marketPosition)
//                   this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(stateTwoDetails?.alpha.liquidityFactor)
//                   this.specificRiskPremiumModalForm.controls['competition'].setValue(stateTwoDetails?.alpha.competition);
//                   this.calculateCoeAndAdjustedCoe()
//                 }
//               })
//             }
//           }
//         }
//       }
//     )
//   }
// }

closeDialog(){
  this.fcfeDetails.emit({closeDialog: true});
}
}

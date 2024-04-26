import {  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Validators,FormBuilder,FormGroup,FormControl } from '@angular/forms';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimationBuilder, animate, style } from '@angular/animations';
import { MatStepper } from '@angular/material/stepper';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { BETA_FROM_TYPE, BETA_SUB_TYPE, MODELS } from 'src/app/shared/enums/constant';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { formatNumber } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-excess-earning-details',
  templateUrl: './excess-earning-details.component.html',
  styleUrls: ['./excess-earning-details.component.scss']
})
export class ExcessEarningDetailsComponent {

  modelControl:any = groupModelControl;

  @Output() excessEarnDetails=new EventEmitter<any>();
  @Output() excessEarnDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() formTwoData:any;
  @Input() thirdStageInput:any;
  @Input() next:any;

  excessEarningForm:any;
  specificRiskPremiumModalForm:any;
  hasError = hasError;
  floatLabelType:any = 'never';
  discountR: any=[];
  equityM: any=[];
  indianTreasuryY: any=[];
  rPremium:any=[];
  adjCoe:number=0;
  coe:number=0;
  apiCallMade = false;
  isLoader = false;
  isDialogOpen = false;
  bse500Value:number=0;
  meanBeta = false;
  medianBeta = true;
  betaLoader=false;
  selectedSubBetaType:any = BETA_SUB_TYPE[0];
  stockBetaChecker = false;
  @ViewChild(MatStepper, { static: false }) stepper!: MatStepper;
  
constructor(private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar,
  private calculationsService: CalculationsService,
  private processStatusManagerService:ProcessStatusManagerService,
  private ciqSpService:CiqSPService){
    this.loadFormControl();
  }
  
ngOnChanges(changes:SimpleChanges): void {
  if(this.next !== 4)
    return
  this.formOneData;
  this.checkPreviousAndCurrentValue(changes)
}

ngOnInit(): void {
  // if(this.next === 4){
    this.checkProcessExist();
    this.loadValues();
    this.loadOnChangeValue();
  // }
}

checkProcessExist(){
  if(this.thirdStageInput){
    this.thirdStageInput.map((stateTwoDetails:any)=>{
      if(stateTwoDetails.model === MODELS.EXCESS_EARNINGS && this.formOneData.model.includes(MODELS.EXCESS_EARNINGS)){
        this.excessEarningForm.controls['discountRate'].setValue(stateTwoDetails?.discountRate);
        this.excessEarningForm.controls['discountingPeriod'].setValue(stateTwoDetails?.discountingPeriod);
        this.selectedSubBetaType = stateTwoDetails?.betaSubType ? stateTwoDetails.betaSubType : BETA_SUB_TYPE[0];
        this.excessEarningForm.controls['coeMethod'].setValue(stateTwoDetails?.coeMethod); 
        this.excessEarningForm.controls['riskFreeRate'].setValue(stateTwoDetails?.riskFreeRate); 
        this.excessEarningForm.controls['riskFreeRateYears'].setValue(stateTwoDetails?.riskFreeRateYears); 
        let expectedMarketReturnData:any;
        this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
          if(response.value ===  stateTwoDetails?.expMarketReturnType){
            expectedMarketReturnData = response
          }
        })
        this.bse500Value = stateTwoDetails?.bse500Value;
        this.excessEarningForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData.name);
        this.excessEarningForm.controls['expMarketReturn'].setValue(stateTwoDetails?.expMarketReturn);
        this.excessEarningForm.controls['specificRiskPremium'].setValue(stateTwoDetails?.specificRiskPremium); 
        this.excessEarningForm.controls['riskPremium'].setValue(stateTwoDetails?.riskPremium); 
        this.specificRiskPremiumModalForm.controls['companySize'].setValue(stateTwoDetails?.alpha.companySize);
        this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(stateTwoDetails?.alpha.marketPosition);
        this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(stateTwoDetails?.alpha.liquidityFactor);
        this.specificRiskPremiumModalForm.controls['competition'].setValue(stateTwoDetails?.alpha.competition);
        if(!this.formOneData.companyId && stateTwoDetails.betaType === 'stock_beta'){
          this.excessEarningForm.controls['betaType'].setValue('');
          this.excessEarningForm.controls['beta'].reset();
        }
        else{
          this.excessEarningForm.controls['betaType'].setValue(stateTwoDetails?.betaType) 
          this.excessEarningForm.controls['beta'].setValue(stateTwoDetails?.beta);
        }
        this.calculateCoeAndAdjustedCoe();
      }
    })
  }
  }

loadValues(){
  this.valuationService.getValuationDropdown()
      .subscribe((resp: any) => {
        this.discountR = resp[DROPDOWN.DISCOUNT];
        this.equityM = resp[DROPDOWN.EQUITY];
        this.indianTreasuryY = resp[DROPDOWN.INDIANTREASURYYIELDS],
        this.rPremium = resp[DROPDOWN.PREMIUM];
      });
}

loadOnChangeValue(){
  this.excessEarningForm.controls['expMarketReturnType'].valueChanges.subscribe(
    (val:any) => {
      if(!val) return;

      let expectedMarketReturnData:any;
      this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
        if(response.name ===  val){
          expectedMarketReturnData = response
        }
      })

      if(expectedMarketReturnData.value === "Analyst_Consensus_Estimates"){
        const data={
          data: 'ACE',
          width:'30%',
        }
        const dialogRef = this.dialog.open(GenericModalBoxComponent,data);
        dialogRef.afterClosed().subscribe((result)=>{
          if (result) {
            this.excessEarningForm.controls['expMarketReturn'].patchValue(parseFloat(result?.analystConsensusEstimates))
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.excessEarningForm.controls['expMarketReturnType'].setValue('');
          }
        this.calculateCoeAndAdjustedCoe();
        })
      }
      else{
        this.dataReferenceService.getBSE500(expectedMarketReturnData?.years,this.formOneData?.valuationDate).subscribe(
          (response) => {
            if (response.status) {
              this.excessEarningForm.controls['expMarketReturn'].setValue(response?.result || 0);
              if(!response?.result){
                this.snackBar.open('Expected market return not found', 'Ok',{
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 5000,
                  panelClass: 'app-notification-error',
                })
              }
              this.apiCallMade=false;
              this.bse500Value=response?.close?.Close ? response?.close?.Close.toFixed(2) : 0;
            }
            this.calculateCoeAndAdjustedCoe();
          },
          (error) => {
            console.error(error);
          }
          );
      }
      this.calculateCoeAndAdjustedCoe();
    }
  );

  this.excessEarningForm.controls['riskFreeRateYears'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    if(val === "customRiskFreeRate"){
      const data={
        value: 'customRiskFreeRate',
        riskFreeRate: this.excessEarningForm.controls['riskFreeRate'].value
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%'});
      dialogRef.afterClosed().subscribe((result)=>{
        if (result) {
          // this.customRiskFreeRate = parseFloat(result?.riskFreeRate)
          this.excessEarningForm.controls['riskFreeRate'].setValue(parseFloat(result?.riskFreeRate));
          
          this.snackBar.open('Risk Free Rate Added','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success'
          })
        } else {
          this.excessEarningForm.controls['riskFreeRate'].setValue('');
        }
        this.calculateCoeAndAdjustedCoe();
      })
    }
    else{
      this.calculateRiskFreeRate(val);
    }
  })

  this.excessEarningForm.controls['coeMethod'].valueChanges.subscribe((value:any)=>{
    if(!value) return;
    this.calculateCoeAndAdjustedCoe();
  })
}

loadFormControl(){
    this.excessEarningForm=this.formBuilder.group({
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
  })

  this.specificRiskPremiumModalForm=this.formBuilder.group({
    qualitativeFactor:['',[Validators.required]],
    companySize:['',[Validators.required]],
    marketPosition:['',[Validators.required]],
    liquidityFactor:['',[Validators.required]],
    competition:['',[Validators.required]],
  })
}

getDocList(doc: any) {
    return doc.type;
}

onSlideToggleChange(event:any){
  if(event  && !this.isDialogOpen){
    this.isDialogOpen = true;

    const data = {
      data: {
        ...this.specificRiskPremiumModalForm.value,
        value:'specificRiskPremiumForm'
      },
     
    };
   const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%'});

   dialogRef.afterClosed().subscribe((result) => {
    this.isDialogOpen = false; // Reset the flag

    if (result) {
      this.specificRiskPremiumModalForm.patchValue(result);

      const controlNames = ['companySize', 'marketPosition', 'liquidityFactor', 'competition'];

        const summationQualitativeAnalysis = controlNames.reduce((sum, controlName) => {
          const controlValue = parseFloat(this.specificRiskPremiumModalForm.controls[controlName].value) || 0;
          return sum + controlValue;
        }, 0);

        this.excessEarningForm.controls['riskPremium'].setValue(summationQualitativeAnalysis);
        this.excessEarningForm.controls['riskPremium'].markAsUntouched();
      this.snackBar.open('Specific Risk Premium is added','OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
  this.calculateCoeAndAdjustedCoe();
    } else {
      // this.specificRiskPremiumModalForm.reset();
      // this.snackBar.open('Specific Risk Premium not saved','OK',{
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      //   duration: 3000,
      //   panelClass: 'app-notification-error'
      // })
  this.calculateCoeAndAdjustedCoe();
    }
  });
  }
}

saveAndNext(): void {
  let expectedMarketReturnData:any;
  this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
    if(response.name ===  this.excessEarningForm.controls['expMarketReturnType'].value){
      expectedMarketReturnData = response
    }
  })

  const payload = {...this.excessEarningForm.value,alpha:this.specificRiskPremiumModalForm.value,status:'Excess_Earnings'}

  payload['expMarketReturnType']=expectedMarketReturnData?.value;
  payload['adjustedCostOfEquity']=this.adjCoe;
  payload['costOfEquity']=this.coe;
  payload['bse500Value']=this.bse500Value;
  payload['betaSubType']=this.selectedSubBetaType;
  payload['riskFreeRate'] = +this.excessEarningForm.controls['riskFreeRate'].value;
  

  this.validateControls(this.excessEarningForm.controls,payload);
  
}

validateControls(controlArray: { [key: string]: FormControl },payload:any){
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

    if(!allControlsFilled){
      this.excessEarningForm.markAllAsTouched();
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && !formStat.includes('4')){
        localStorage.setItem('pendingStat',`${[...formStat,'4']}`)
      }
      else{
        localStorage.setItem('pendingStat',`4`)
      }
      localStorage.setItem('stepThreeStats',`false`);
    }
    else{
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && formStat.includes('4')){
        const splitFormStatus = formStat.split(',');
        splitFormStatus.splice(splitFormStatus.indexOf('4'),1);
        localStorage.setItem('pendingStat',`${splitFormStatus}`);
        if(splitFormStatus.length>1){
          localStorage.setItem('stepThreeStats',`false`);
          
        }else{
        localStorage.setItem('stepThreeStats',`true`);
        localStorage.removeItem('pendingStat');
        }
      }
      else if (formStat !== null && !formStat.includes('4')){
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
      thirdStageInput:[{model:MODELS.EXCESS_EARNINGS,...payload,formFillingStatus:allControlsFilled}],
      step:processStateStep
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));

    this.excessEarnDetails.emit(payload);
}

previous(){
  this.excessEarnDetailsPrev.emit({status:'Excess_Earnings'})
}

calculateCoeAndAdjustedCoe() {
  this.isLoader=true
  const coePayload = {
    riskFreeRate: this.excessEarningForm.controls['riskFreeRate'].value,
    expMarketReturn: this.excessEarningForm.controls['expMarketReturn'].value,
    beta: this.excessEarningForm.controls['beta']?.value ? this.excessEarningForm.controls['beta'].value : 0,
    riskPremium: this.excessEarningForm.controls['riskPremium'].value,
    coeMethod: this.excessEarningForm.controls['coeMethod'].value,
  };

  this.calculationsService.getCostOfEquity(coePayload).subscribe((response: any) => {
    if (response.status) {
      this.adjCoe = response?.result?.adjCOE;
      this.coe = response?.result?.coe;
      // Set the flag to true to indicate that the API call has been made.
      this.apiCallMade = true;
      this.isLoader=false;
    }
  });
  this.isLoader=false;
  // Always return false the first time to prevent the template from displaying prematurely.
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

checkPreviousAndCurrentValue(changes:any){
  if (this.formOneData && changes['formOneData'] ) {
    const current = changes['formOneData'].currentValue;
    const previous = changes['formOneData'].previousValue;
    
    if((current?.valuationDate && previous?.valuationDate) && current.valuationDate !== previous.valuationDate){
      this.excessEarningForm.controls['expMarketReturnType'].setValue('');
      this.excessEarningForm.controls['expMarketReturn'].reset();
      this.excessEarningForm.controls['betaType'].setValue('');
      this.excessEarningForm.controls['beta'].reset();
      this.calculateRiskFreeRate(this.excessEarningForm.controls['riskFreeRateYears'].value)
    }

    this.stockBetaCheck(current, previous);
  }
  if(this.equityM?.length > 0){
    this.excessEarningForm.controls['coeMethod'].setValue(this.equityM[0].type);
  }

  this.calculationsService.betaChangeDetector.subscribe((detector:any)=>{
    if(detector.status){
      this.excessEarningForm.controls['betaType'].setValue('');
      this.excessEarningForm.controls['beta'].reset();
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
    else{
      this.selectedSubBetaType = '';
      this.excessEarningForm.controls['beta'].setValue(1);
      this.calculateCoeAndAdjustedCoe();
    }
  }
  else{
    const aswathDamodaranSelectedBetaObj = this.formTwoData?.formTwoData?.aswathDamodaranSelectedBetaObj;
    if(selectedValue.includes('unlevered')){
      this.excessEarningForm.controls['beta'].setValue(aswathDamodaranSelectedBetaObj?.unleveredBeta);
      this.calculateCoeAndAdjustedCoe();
    }
    else if(selectedValue.includes('levered')){
      this.excessEarningForm.controls['beta'].setValue(aswathDamodaranSelectedBetaObj?.beta);
      this.calculateCoeAndAdjustedCoe();
    }
    else{
      this.selectedSubBetaType = '';
      this.excessEarningForm.controls['beta'].setValue(1);
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
  if(!current.companyId && this.excessEarningForm.controls['betaType'].value === 'stock_beta'){
    this.excessEarningForm.controls['betaType'].setValue('');
    this.excessEarningForm.controls['beta'].reset();
  }
  else if(current.companyId && current.companyId !== previous?.companyId && this.excessEarningForm.controls['betaType'].value === 'stock_beta'){
    this.calculateStockBeta();
  }
}

calculateBeta(betaSubType:any){
  const betaPayload = {
    industryAggregateList: this.formTwoData.formTwoData.selectedIndustries,
    betaSubType: betaSubType,
    taxRate: this.formOneData.taxRate || this.formTwoData.formOneData.taxRate,
    betaType: this.excessEarningForm.controls['betaType'].value,
    valuationDate: this.formOneData.valuationDate || this.formTwoData.formOneData.valuationDate
  }
  this.betaLoader = true
  this.ciqSpService.calculateSPindustryBeta(betaPayload).subscribe((betaData:any)=>{
    if(betaData.status){
      this.betaLoader = false;
      this.excessEarningForm.controls['beta'].setValue(betaData.total);
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

calculateRiskFreeRate(maturityYears:any){
  if(!maturityYears)
    return;
  this.calculationsService.getRiskFreeRate(maturityYears,this.formOneData.valuationDate).subscribe((response:any)=>{
    if(response.status){
      this.excessEarningForm.controls['riskFreeRate'].setValue(formatNumber(response.riskFreeRate));
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
        this.excessEarningForm.controls['beta'].setValue(response.total);
      }
      if(!response.isStockBetaPositive && !response.total){
        this.excessEarningForm.controls['beta'].setValue(response.negativeBeta);
      }
      if(!response.total){
        this.excessEarningForm.controls['beta'].setValue(response.total);
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
    const betaDropdownValues = this.modelControl.fcfe.options.betaType.options.slice();
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
    this.excessEarningForm.controls[controlName].setValue('');
    this.clearRelatedControls(controlName);
  }

  clearRelatedControls(controls:any){
    switch(controls){
      case 'riskFreeRateYears':
        this.excessEarningForm.controls['riskFreeRate'].setValue('');
      break;
      case 'expMarketReturnType':
        this.excessEarningForm.controls['expMarketReturn'].setValue('');
      break;
      case 'betaType':
        this.excessEarningForm.controls['beta'].setValue('');
      break;
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
    if (this.excessEarningForm.controls['betaType'].value === 'market_beta' || this.excessEarningForm.controls['betaType'].value === 'stock_beta') {
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
}


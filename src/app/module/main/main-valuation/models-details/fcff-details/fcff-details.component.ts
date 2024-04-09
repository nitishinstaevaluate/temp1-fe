import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { BETA_SUB_TYPE, MODELS } from 'src/app/shared/enums/constant';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { convertToNumberOrZero, formatNumber } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-fcff-details',
  templateUrl: './fcff-details.component.html',
  styleUrls: ['./fcff-details.component.scss']
})
export class FcffDetailsComponent implements OnInit{

  modelControl:any = groupModelControl;

  @Input() formOneData:any;
  @Output() fcffDetails=new EventEmitter<any>();
  @Output() fcffDetailsPrev=new EventEmitter<any>();
  @Input() thirdStageInput:any;
  @Input() formTwoData:any;
  @Input() next:any;

  
  fcffForm:any=FormGroup;
  specificRiskPremiumModalForm:any=FormGroup;
  targetCapitalStructureForm:any=FormGroup;

  hasError = hasError;
  floatLabelType:any = 'never';
  discountR: any=[];
  equityM: any=[];
  indianTreasuryY: any=[];
  cStructure:any=[];
  rPremium:any=[];
  debtRatio: any;
  totalCapital: any;
  debtProp: any;
  prefProp: any;
  equityProp: any;
  deRatio:number=0;
  adjCoe:number=0;
  coe:number=0;
  wacc:number=0;
  apiCallMade = false;
  isLoader = false;
  isDialogOpen = false; 
  bse500Value:number=0;
  customRiskFreeRate = 0;
  meanBeta = false;
  medianBeta = true;
  betaLoader=false;
  selectedSubBetaType:any = BETA_SUB_TYPE[0];
  stockBetaChecker = false;  
  betaMeanMedianWorking:any;
constructor(private valuationService:ValuationService,
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
  if(this.next !== 2 )
    return;

  this.formOneData;
  this.checkPreviousAndCurrentValue(changes)
}

ngOnInit(): void {
  // if(this.next === 2){
  // this.loadFormControl();
  this.checkProcessExist();
  this.loadValues();
  this.loadOnChangeValue();
  // }
}

checkProcessExist(){
  if(this.thirdStageInput){
    this.thirdStageInput.map((stateThreeDetails:any)=>{
      if(stateThreeDetails.model === MODELS.FCFF && this.formOneData.model.includes(MODELS.FCFF)){
        this.fcffForm.controls['discountRate'].setValue(stateThreeDetails?.discountRate) 
        this.fcffForm.controls['discountingPeriod'].setValue(stateThreeDetails?.discountingPeriod) 
        this.selectedSubBetaType = stateThreeDetails?.betaSubType ? stateThreeDetails.betaSubType : BETA_SUB_TYPE[0];
        this.fcffForm.controls['coeMethod'].setValue(stateThreeDetails?.coeMethod); 
        this.fcffForm.controls['riskFreeRate'].setValue(stateThreeDetails?.riskFreeRate); 
        this.fcffForm.controls['riskFreeRateYears'].setValue(stateThreeDetails?.riskFreeRateYears); 
        let expectedMarketReturnData:any;
        this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
          if(response.value ===  stateThreeDetails?.expMarketReturnType){
            expectedMarketReturnData = response
          }
        })
        this.fcffForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData.name);
        this.fcffForm.controls['expMarketReturn'].setValue(stateThreeDetails?.expMarketReturn);
        this.fcffForm.controls['specificRiskPremium'].setValue(stateThreeDetails?.specificRiskPremium); 
        this.fcffForm.controls['riskPremium'].setValue(stateThreeDetails?.riskPremium); 
        this.fcffForm.controls['costOfDebt'].setValue(stateThreeDetails?.costOfDebt);
        this.fcffForm.controls['capitalStructureType'].setValue(stateThreeDetails?.capitalStructureType);
        if(stateThreeDetails?.capitalStructure){
          this.targetCapitalStructureForm.controls['equityProportion'].setValue(stateThreeDetails.capitalStructure?.equityProp);
          this.targetCapitalStructureForm.controls['preferenceProportion'].setValue(stateThreeDetails.capitalStructure?.prefProp);
          this.targetCapitalStructureForm.controls['debtProportion'].setValue(stateThreeDetails.capitalStructure?.debtProp);
          this.targetCapitalStructureForm.controls['totalCapital'].setValue(stateThreeDetails.capitalStructure?.totalCapital);
          this.debtProp = stateThreeDetails.capitalStructure.debtProp;
          this.equityProp = stateThreeDetails.capitalStructure.equityProp;
          this.prefProp = stateThreeDetails.capitalStructure.prefProp;
          this.totalCapital = this.targetCapitalStructureForm.controls['totalCapital'].value;
        }
        this.fcffForm.controls['copShareCapital'].setValue(stateThreeDetails?.copShareCapital);
        this.bse500Value = stateThreeDetails?.bse500Value;
        this.specificRiskPremiumModalForm.controls['companySize'].setValue(stateThreeDetails?.alpha.companySize)
        this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(stateThreeDetails?.alpha.marketPosition)
        this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(stateThreeDetails?.alpha.liquidityFactor)
        this.specificRiskPremiumModalForm.controls['competition'].setValue(stateThreeDetails?.alpha.competition);
        if(!this.formOneData.companyId && stateThreeDetails.betaType === 'stock_beta'){
          this.fcffForm.controls['betaType'].setValue('');
          this.fcffForm.controls['beta'].reset();
        }
        else{
          this.fcffForm.controls['betaType'].setValue(stateThreeDetails?.betaType) 
          this.fcffForm.controls['beta'].setValue(stateThreeDetails?.beta);
        }
        this.calculateCoeAndAdjustedCoe()
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
        this.cStructure = resp[DROPDOWN.CAPTIAL_STRUCTURE]
        // this.cStructure.push({type:'Target_Based',label:'Target Capital Structure'});
      });
}

loadOnChangeValue(){
  this.fcffForm.controls['expMarketReturnType'].valueChanges.subscribe(
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
            this.fcffForm.controls['expMarketReturn'].patchValue(parseFloat(result?.analystConsensusEstimates))
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.fcffForm.controls['expMarketReturnType'].setValue('');
          }
          this.calculateCoeAndAdjustedCoe();
        })
      }
      else{
        this.dataReferenceService.getBSE500(expectedMarketReturnData?.years,this.formOneData?.valuationDate).subscribe(
          (response) => {
            if (response.status) {
              this.fcffForm.controls['expMarketReturn'].value = response?.result;
              this.bse500Value=response?.close?.Close.toFixed(2);
              
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
  this.fcffForm.controls['capitalStructureType'].valueChanges.subscribe(
  (val:any) => {
      if(!val) return;
      if (val == 'Industry_Based') {
        if(this.formTwoData.formTwoData.betaFrom !== 'aswathDamodaran'){
          this.loadIndustryBasedDeRatioAndEquityRatio();
        }
        else{
          const adDeRatio = this.formTwoData.formTwoData.aswathDamodaranSelectedBetaObj;
          if(adDeRatio?.deRatio){
            if(`${adDeRatio.deRatio}`.includes('%')){
              this.deRatio = adDeRatio.deRatio.split('%')[0];
            }
            else{
              this.deRatio = adDeRatio.deRatio;
            }
          }
          else{
            this.deRatio = 0;
          }
          this.deRatio = adDeRatio?.deRatio ? (adDeRatio.deRatio.split('%')[0]) : 0;
          this.getWaccIndustryOrCompanyBased();
        }
      } else if(val === 'Company_Based'){
        this.debtProp = null;
        this.equityProp = null;
        this.prefProp = null;
        this.totalCapital = null;
        this.getWaccIndustryOrCompanyBased();
      } else {
        const data={
          value: 'targetCapitalStructure',
          debtProp: this.targetCapitalStructureForm.controls['debtProportion'].value,
          equityProp: this.targetCapitalStructureForm.controls['equityProportion'].value,
          prefProp: this.targetCapitalStructureForm.controls['preferenceProportion'].value,
          totalCapital: this.targetCapitalStructureForm.controls['totalCapital'].value
        }
        const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data, width:'30%'});

        dialogRef.afterClosed().subscribe((result)=>{
          if(result){
            this.targetCapitalStructureForm.setValue(result);

            // this.deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio);
            this.debtProp = +this.targetCapitalStructureForm.controls['debtProportion'].value;
            this.equityProp = +this.targetCapitalStructureForm.controls['equityProportion'].value;
            this.prefProp = +this.targetCapitalStructureForm.controls['preferenceProportion'].value;
            this.totalCapital = +this.targetCapitalStructureForm.controls['totalCapital'].value;

            this.snackBar.open('Target Capital Structure saved','Ok',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
            this.calculateCoeAndAdjustedCoe();

          }
          else {
            this.fcffForm.controls['capitalStructureType'].reset();

            this.snackBar.open('Target Capital Structure Not Saved','OK',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
            this.calculateCoeAndAdjustedCoe()
           
          }
          
        })
       
      }

    }
  );
  
  this.fcffForm.controls['copShareCapital'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    this.calculateCoeAndAdjustedCoe();
  })

  this.fcffForm.controls['riskFreeRateYears'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    if(val === "customRiskFreeRate"){
      const data={
        value: 'customRiskFreeRate',
        riskFreeRate: this.fcffForm.controls['riskFreeRate'].value
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%'});
      dialogRef.afterClosed().subscribe((result)=>{
        if (result) {
          this.fcffForm.controls['riskFreeRate'].setValue(parseFloat(result?.riskFreeRate));
          
          this.snackBar.open('Risk Free Rate Added','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success'
          })
        } else {
          this.fcffForm.controls['riskFreeRate'].setValue('');
        }
        this.calculateCoeAndAdjustedCoe();
      })
    }
    else{
      this.calculateRiskFreeRate(val);
    }
  })
  this.fcffForm.controls['costOfDebt'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    this.calculateCoeAndAdjustedCoe();
  })
  this.fcffForm.controls['coeMethod'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    this.calculateCoeAndAdjustedCoe();
  })

}

loadFormControl(){
    this.fcffForm=this.formBuilder.group({
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
    capitalStructureType:['',[Validators.required]],
    costOfDebt:['',[Validators.required]],
    copShareCapital:['',[Validators.required]],
  })

  this.specificRiskPremiumModalForm=this.formBuilder.group({
    qualitativeFactor:['',[Validators.required]],
    companySize:['',[Validators.required]],
    marketPosition:['',[Validators.required]],
    liquidityFactor:['',[Validators.required]],
    competition:['',[Validators.required]],
  })

  this.targetCapitalStructureForm=this.formBuilder.group({
    equityProportion:['',[Validators.required]],
    debtProportion:['',[Validators.required]],
    preferenceProportion:['',[Validators.required]],
    totalCapital:['',[Validators.required]],
  })
}

getDocList(doc: any) {
    return doc.type;
}

onSlideToggleChange(event:any){
  if(event && !this.isDialogOpen){
    this.isDialogOpen = true;

    const data = {
      data: {
        ...this.specificRiskPremiumModalForm.value,
        value:'specificRiskPremiumForm'
      }
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

        this.fcffForm.controls['riskPremium'].setValue(summationQualitativeAnalysis);
        this.fcffForm.controls['riskPremium'].markAsUntouched();

      this.snackBar.open('Specific Risk Premium is added','OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
      this.calculateCoeAndAdjustedCoe()
    } else {
      // this.specificRiskPremiumModalForm.reset();
      // this.snackBar.open('Specific Risk Premium not saved','OK',{
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      //   duration: 3000,
      //   panelClass: 'app-notification-error'
      // })
      this.calculateCoeAndAdjustedCoe()
    }
  });
  }
}

saveAndNext(): void {
  let expectedMarketReturnData:any;
  this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
    if(response.name ===  this.fcffForm.controls['expMarketReturnType'].value){
      expectedMarketReturnData = response
    }
  })
  const payload = {...this.fcffForm.value,alpha:this.specificRiskPremiumModalForm.value,status:'FCFF'}

    let capitalStructure = {
        deRatio:this.deRatio ,
        debtProp:this.debtProp,
        equityProp:this.equityProp,
        prefProp:this.prefProp ,
        totalCapital:this.totalCapital,
    }
    payload['capitalStructure'] = capitalStructure;
  payload['adjustedCostOfEquity']=this.adjCoe;
  payload['costOfEquity']=this.coe;
  payload['wacc']=this.wacc;
  payload['bse500Value']=this.bse500Value;
  payload['betaSubType']=this.selectedSubBetaType;
  payload['riskFreeRate'] = +this.fcffForm.controls['riskFreeRate'].value;
  // check if expected market return  is empty or not
 
  payload['expMarketReturnType']=expectedMarketReturnData.value;

  const controls = {...this.fcffForm.controls};
  this.validateControls(controls,payload);
}

previous(){
  this.fcffDetailsPrev.emit({status:'FCFF'})
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
      this.fcffForm.markAllAsTouched();
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && !formStat.includes('2')){
        localStorage.setItem('pendingStat',`${[...formStat,'2']}`)
      }
      else{
        localStorage.setItem('pendingStat',`2`)
      }
      localStorage.setItem('stepThreeStats',`false`);
    }
    else{
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && formStat.includes('2')){
        const splitFormStatus = formStat.split(',');
        splitFormStatus.splice(splitFormStatus.indexOf('2'),1);
        localStorage.setItem('pendingStat',`${splitFormStatus}`);
        if(splitFormStatus.length>1){
          localStorage.setItem('stepThreeStats',`false`);
          
        }else{
        localStorage.setItem('stepThreeStats',`true`);
        localStorage.removeItem('pendingStat');
        }
      }
      else if (formStat !== null && !formStat.includes('2')){
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
      thirdStageInput:[{model:MODELS.FCFF,...payload,formFillingStatus:allControlsFilled}],
      step:processStateStep
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))

    this.fcffDetails.emit(payload);
}


calculateCoeAndAdjustedCoe() {
  this.isLoader=true
  const coePayload = {
    riskFreeRate: this.fcffForm.controls['riskFreeRate'].value,
    expMarketReturn: this.fcffForm.controls['expMarketReturn'].value,
    beta: this.fcffForm.controls['beta']?.value ? this.fcffForm.controls['beta'].value : 0,
    riskPremium: this.fcffForm.controls['riskPremium'].value,
    coeMethod: this.fcffForm.controls['coeMethod'].value,
  };

  this.calculationsService.getCostOfEquity(coePayload).subscribe((response: any) => {
    if (response.status) {
     this.adjCoe=response.result.adjCOE;
     this.coe=response.result.coe;
      this.getWaccIndustryOrCompanyBased();
    }
  });
  this.isLoader=false;
  // Always return false the first time to prevent the template from displaying prematurely.
  return false;
}

getWaccIndustryOrCompanyBased(){

  if(this.fcffForm.controls['capitalStructureType'].value=== 'Target_Based'){
    // console.log()
    const waccPayload={
      adjCoe:this.adjCoe,
      equityProp:this.equityProp,
      costOfDebt:this.fcffForm.controls['costOfDebt'].value,
      taxRate:this.formOneData?.taxRate?.includes('%') ? parseFloat(this.formOneData?.taxRate.replace("%", "")) : this.formOneData?.taxRate,
      debtProp:this.debtProp,
      copShareCapital:this.fcffForm.controls['copShareCapital'].value,
      prefProp:this.prefProp,
      coeMethod:this.fcffForm.controls['coeMethod'].value
    }
    this.calculationsService.getWacc(waccPayload).subscribe((data:any)=>{
      if(data.status){
        this.adjCoe = data?.result?.adjCOE;
        this.wacc = data?.result?.wacc/100;
        this.isLoader=false;
      }
    })
    this.isLoader=false;
  }
  else{
    const payload={
      adjCoe:this.adjCoe,
      excelSheetId:this.formOneData.excelSheetId,
      costOfDebt:this.fcffForm.controls['costOfDebt'].value,
      copShareCapital:this.fcffForm.controls['copShareCapital'].value,
      deRatio:this.deRatio,
      type:this.fcffForm.controls['capitalStructureType'].value,
      taxRate:this.formOneData?.taxRate?.includes('%') ? parseFloat(this.formOneData?.taxRate.replace("%", "")) : this.formOneData?.taxRate,
    }
    this.calculationsService.getWaccIndustryOrCompanyBased(payload).subscribe((response:any)=>{
      if(response.status){
        this.adjCoe = response?.result?.adjCOE;
        this.wacc = response?.result?.wacc;
      }
    })
  }
}

checkPreviousAndCurrentValue(changes:any){
  if (this.formOneData && changes['formOneData'] ) {
    const current = changes['formOneData'].currentValue;
    const previous = changes['formOneData'].previousValue;
    
    if((current?.valuationDate && previous?.valuationDate) && current.valuationDate !== previous.valuationDate){
      this.fcffForm.controls['expMarketReturnType'].setValue('');
      this.fcffForm.controls['expMarketReturn'].reset();
      this.calculateRiskFreeRate(this.fcffForm.controls['riskFreeRateYears'].value)
    }

    this.stockBetaCheck(current, previous);
  }
  if(this.equityM?.length > 0){
    this.fcffForm.controls['coeMethod'].setValue(this.equityM[0].type);
  }

  this.calculationsService.betaChangeDetector.subscribe((detector:any)=>{
    if(detector.status){
      // If beta from type or any industry/company is re-selected, reset the fields
      this.fcffForm.controls['betaType'].setValue('');
      this.fcffForm.controls['beta'].reset();
      this.fcffForm.controls['capitalStructureType'].reset();
      this.deRatio = 0;
    }
  })
}

onRadioButtonChange(event:any){
  this.calculateBeta(event?.target?.value)
}

betaChange(event:any){
  const selectedValue = event.value;
if(selectedValue){
  if(this.formTwoData?.formTwoData?.betaFrom !== 'aswathDamodaran'){
    if(selectedValue.includes('unlevered') || selectedValue.includes('levered')){
      this.calculateBeta(BETA_SUB_TYPE[0]);
    }
    else if(selectedValue.includes('stock_beta')){
      this.calculateStockBeta();
    }
    else{
      this.selectedSubBetaType = '';
      this.fcffForm.controls['beta'].setValue(1);
      this.calculateCoeAndAdjustedCoe();
    }
  }
  else{
    const aswathDamodaranSelectedBetaObj = this.formTwoData?.formTwoData?.aswathDamodaranSelectedBetaObj;
    if(selectedValue.includes('unlevered')){
      this.fcffForm.controls['beta'].setValue(aswathDamodaranSelectedBetaObj?.unleveredBeta);
      this.calculateCoeAndAdjustedCoe();
    }
    else if(selectedValue.includes('levered')){
      this.fcffForm.controls['beta'].setValue(aswathDamodaranSelectedBetaObj?.beta);
      this.calculateCoeAndAdjustedCoe();
    }
    else{
      this.selectedSubBetaType = '';
      this.fcffForm.controls['beta'].setValue(1);
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
  if(!current.companyId && this.fcffForm.controls['betaType'].value === 'stock_beta'){
    this.fcffForm.controls['betaType'].setValue('');
    this.fcffForm.controls['beta'].reset();
  }
  else if(current.companyId && current.companyId !== previous?.companyId && this.fcffForm.controls['betaType'].value === 'stock_beta'){
    this.calculateStockBeta();
  }
}

calculateBeta(betaSubType:any){
const betaPayload = {
  industryAggregateList: this.formTwoData.formTwoData.selectedIndustries,
  betaSubType: betaSubType,
  taxRate: this.formOneData.taxRate || this.formTwoData.formOneData.taxRate,
  betaType: this.fcffForm.controls['betaType'].value,
  valuationDate: this.formOneData.valuationDate || this.formTwoData.formOneData.valuationDate
}
this.betaLoader = true
this.ciqSpService.calculateSPindustryBeta(betaPayload).subscribe((betaData:any)=>{
  if(betaData.status){
    this.betaLoader = false;
    this.fcffForm.controls['beta'].setValue(betaData.total);
    this.selectedSubBetaType = betaSubType;

    this.processStatusManagerService.fetchProcessIdentifierId(localStorage.getItem('processStateId')).subscribe(async (processManagerDetails:any)=>{
      this.betaLoader = false;
        if(processManagerDetails){
          const payload = {
            coreBetaWorking:betaData.coreBetaWorking,
            betaMeanMedianWorking: betaData.betaMeanMedianWorking,
            processIdentifierId: processManagerDetails.processIdentifierId
          }
          this.computeIndustryRatios(betaData.betaMeanMedianWorking);
          await this.ciqSpService.upsertBetaWorking(payload).toPromise();
          this.calculateCoeAndAdjustedCoe();
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

calculateRiskFreeRate(maturityYears:any){
  if(!maturityYears)
    return;
  this.calculationsService.getRiskFreeRate(maturityYears,this.formOneData.valuationDate).subscribe((response:any)=>{
    if(response.status){
      this.fcffForm.controls['riskFreeRate'].setValue(formatNumber(response.riskFreeRate));
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
        this.fcffForm.controls['beta'].setValue(response.total);
      }
      if(!response.isStockBetaPositive && !response.total){
        this.fcffForm.controls['beta'].setValue(response.negativeBeta);
      }
      if(!response.total){
        this.fcffForm.controls['beta'].setValue(response.total);
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
    const betaDropdownValues = this.modelControl.fcff.options.betaType.options.slice();
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
    this.fcffForm.controls[controlName].setValue('');
    this.clearRelatedControls(controlName);
  }

  clearRelatedControls(controls:any){
    switch(controls){
      case 'riskFreeRateYears':
        this.fcffForm.controls['riskFreeRate'].setValue('');
      break;
      case 'expMarketReturnType':
        this.fcffForm.controls['expMarketReturn'].setValue('');
      break;
      case 'betaType':
        this.fcffForm.controls['beta'].setValue('');
      break;
    }
  }

  handleBetaClick() {
    if (this.fcffForm.controls['betaType'].value === 'market_beta' || this.fcffForm.controls['betaType'].value === 'stock_beta') {
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

  async loadIndustryBasedDeRatioAndEquityRatio(){
    const processManagerDetails:any = await this.processStatusManagerService.fetchProcessIdentifierId(localStorage.getItem('processStateId')).toPromise();
    if(processManagerDetails?.processIdentifierId){
      this.ciqSpService.fetchBetaWorking(processManagerDetails?.processIdentifierId).subscribe((betaWorkingResponse:any)=>{
        if(betaWorkingResponse.status){
          const betaMeanMedian = betaWorkingResponse.data.betaMeanMedianWorking
          this.computeIndustryRatios(betaMeanMedian);
          }
          else{
            this.snackBar.open('beta working not found, try again', 'Ok',{
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
              panelClass: 'app-notification-error',
            })
          }
          this.getWaccIndustryOrCompanyBased();
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

  computeIndustryRatios(betaMeanMedian:any){
    if(this.fcffForm.controls['capitalStructureType'].value === 'Industry_Based'){
      betaMeanMedian.map((indRatios:any)=>{        
        if(this.selectedSubBetaType === indRatios.betaType){
          this.deRatio = convertToNumberOrZero(indRatios.debtToCapital)/convertToNumberOrZero(indRatios.equityToCapital);
          this.equityProp = indRatios.equityToCapital;
        }
      })
    }
    else{
      // this.deRatio = 0;  
      // this.equityProp = 0;
    }
  }
}

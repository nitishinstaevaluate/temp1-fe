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
import { MODELS } from 'src/app/shared/enums/constant';

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
  customRiskFreeRate = 0;

  @ViewChild(MatStepper, { static: false }) stepper!: MatStepper;
  
constructor(private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar,
  private calculationsService: CalculationsService,
  private processStatusManagerService:ProcessStatusManagerService){}
  
ngOnChanges(changes:SimpleChanges): void {
  // if(this.next === 4){
  //   this.loadFormControl();
  //   this.checkProcessExist();
  //   this.loadValues();
  //   this.loadOnChangeValue();
  this.formOneData;
    if (changes['formOneData']) {
      const current = changes['formOneData'].currentValue;
      const previous = changes['formOneData'].previousValue;
      if((current && previous) && current.industry !== previous.industry){
        this.excessEarningForm.controls['betaType'].setValue('');
        this.excessEarningForm.controls['beta'].reset();
      }
      if((current && previous) && current.valuationDate !== previous.valuationDate){
        this.excessEarningForm.controls['expMarketReturnType'].setValue('');
        this.excessEarningForm.controls['expMarketReturn'].reset();
      }
    }
    if(this.equityM?.length > 0){
      this.excessEarningForm.controls['coeMethod'].setValue(this.equityM[0].type);
    }
  // }
}

ngOnInit(): void {
  // if(this.next === 4){
    this.loadFormControl();
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
        this.excessEarningForm.controls['betaType'].setValue(stateTwoDetails?.betaType);
        this.excessEarningForm.controls['coeMethod'].setValue(stateTwoDetails?.coeMethod); 
        this.excessEarningForm.controls['riskFreeRate'].setValue(stateTwoDetails?.riskFreeRate); 
        let expectedMarketReturnData:any;
        this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
          if(response.value ===  stateTwoDetails?.expMarketReturnType){
            expectedMarketReturnData = response
          }
        })
        this.excessEarningForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData.name);
        this.excessEarningForm.controls['expMarketReturn'].setValue(stateTwoDetails?.expMarketReturn);
        this.excessEarningForm.controls['specificRiskPremium'].setValue(stateTwoDetails?.specificRiskPremium); 
        this.excessEarningForm.controls['beta'].setValue(stateTwoDetails?.beta);
        this.excessEarningForm.controls['riskPremium'].setValue(stateTwoDetails?.riskPremium); 
        this.specificRiskPremiumModalForm.controls['companySize'].setValue(stateTwoDetails?.alpha.companySize);
        this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(stateTwoDetails?.alpha.marketPosition);
        this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(stateTwoDetails?.alpha.liquidityFactor);
        this.specificRiskPremiumModalForm.controls['competition'].setValue(stateTwoDetails?.alpha.competition);
        this.calculateCoeAndAdjustedCoe();
      }
    })
  }
  }

loadValues(){
  forkJoin([this.valuationService.getValuationDropdown(),this.dataReferenceService.getIndianTreasuryYields(),
    this.dataReferenceService.getHistoricalReturns(),
    this.dataReferenceService.getBetaIndustries()
  ])
    .subscribe((resp: any) => {
      this.discountR = resp[0][DROPDOWN.DISCOUNT];
      this.equityM = resp[0][DROPDOWN.EQUITY];
      this.indianTreasuryY = resp[DROPDOWN.INDIANTREASURYYIELDS],
      this.rPremium = resp[0][DROPDOWN.PREMIUM];
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
              this.excessEarningForm.controls['expMarketReturn'].value = response?.result;
              this.apiCallMade=false;
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

  this.excessEarningForm.controls['betaType'].valueChanges.subscribe((val:any) => {
    if(!val) return;
    const beta = parseFloat(this.formOneData?.betaIndustry?.beta);
    if (val == 'levered'){
      this.excessEarningForm.controls['beta'].setValue(
        beta
        );
      }
      else if (val == 'unlevered') {
      const deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio)/100
      const effectiveTaxRate = parseFloat(this.formOneData?.betaIndustry?.effectiveTaxRate)/100;        
      const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
      this.excessEarningForm.controls['beta'].setValue(
        unleveredBeta
      );
    }
    else if (val == 'market_beta') {
      this.excessEarningForm.controls['beta'].setValue(1);
    }
    else {
      // Do nothing for now
    }
    this.calculateCoeAndAdjustedCoe()
    
  });

  this.excessEarningForm.controls['riskFreeRate'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    if(val === "customRiskFreeRate"){
      const data={
        value: 'customRiskFreeRate',
        riskFreeRate: this.customRiskFreeRate
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%'});
      dialogRef.afterClosed().subscribe((result)=>{
        if (result) {
          this.customRiskFreeRate = parseFloat(result?.riskFreeRate)
          
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
      this.calculateCoeAndAdjustedCoe();
    }
  })

  this.excessEarningForm.controls['coeMethod'].valueChanges.subscribe((value:any)=>{
    if(!value) return;
    this.calculateCoeAndAdjustedCoe();
  })
}

loadFormControl(){
    this.excessEarningForm=this.formBuilder.group({
    discountRate:['',[Validators.required]],
    discountingPeriod:['',[Validators.required]],
    betaType:['',[Validators.required]],
    coeMethod:['',[Validators.required]],
    riskFreeRate:['',[Validators.required]],
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
  if (this.formOneData?.model.length>0 && this.formOneData?.model.includes('FCFE')) {
    this.excessEarningForm.controls['discountRate'].setValue('Cost_Of_Equity');
  } else if (this.formOneData?.model.length>0 && this.formOneData?.model.includes('FCFF')) {
    this.excessEarningForm.controls['discountRate'].setValue('Cost_Of_Equity'); //temporary set value as cost of equity ,change later
  }
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
  
  if(this.excessEarningForm.controls['riskFreeRate'].value  === 'customRiskFreeRate'){
    payload['riskFreeRate'] = this.customRiskFreeRate
  }

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
    riskFreeRate: this.excessEarningForm.controls['riskFreeRate'].value === 'customRiskFreeRate' ? this.customRiskFreeRate : this.excessEarningForm.controls['riskFreeRate'].value,
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
}


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
import { MatStepper } from '@angular/material/stepper';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { BETA_SUB_TYPE, MODELS } from 'src/app/shared/enums/constant';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';

@Component({
  selector: 'app-fcfe-details',
  templateUrl: './fcfe-details.component.html',
  styleUrls: ['./fcfe-details.component.scss']
})
export class FcfeDetailsComponent implements OnChanges,OnInit{

  modelControl:any = groupModelControl;

  @Output() fcfeDetails=new EventEmitter<any>();
  @Output() fcfeDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() thirdStageInput:any;
  @Input() formTwoData:any;
  @Input() next:any;

  hasError=hasError
  fcfeForm:any;
  specificRiskPremiumModalForm:any;
  floatLabelType:any = 'never';
  discountR: any=[];
  equityM: any=[];
  indianTreasuryY: any=[];
  rPremium:any=[];
  adjCoe:number=0;
  coe:number=0;
  apiCallMade = false;
  isLoader = false;
  riskRate:any;
  isDialogOpen = false;
  bse500Value:number=0;
  customRiskFreeRate = 0;
  meanBeta = false;
  medianBeta = true;
  betaLoader=false;
  selectedSubBetaType:any = BETA_SUB_TYPE[0];

  @ViewChild('countElement', { static: false }) countElement!: ElementRef;
  @ViewChild(MatStepper, { static: false }) stepper!: MatStepper;
  
constructor(private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar,
  private calculationsService:CalculationsService,
  private processStatusManagerService:ProcessStatusManagerService,
  private ciqSpService:CiqSPService){}
  
ngOnChanges(changes:SimpleChanges): void {
  if(this.next !==1 )
    return;
  // if(this.next === 1){
  //   this.loadFormControl();
  //   // this.patchFcfeDetails()
  //   this.checkProcessExist()
  //   this.loadValues();
  //   this.loadOnChangeValue();
    this.formOneData;
    this.checkPreviousAndCurrentValue(changes)
    // if(){
      // if (this.formOneData && changes['formOneData'] ) {
      //   const current = changes['formOneData'].currentValue;
      //   const previous = changes['formOneData'].previousValue;
      //   if((current && previous) && current.industry !== previous.industry){
      //     this.fcfeForm.controls['betaType'].setValue('');
      //     this.fcfeForm.controls['beta'].reset();
      //   }
      //   if((current && previous) && current.valuationDate !== previous.valuationDate){
      //     this.fcfeForm.controls['expMarketReturnType'].setValue('');
      //     this.fcfeForm.controls['expMarketReturn'].reset();
      //   }
      // }
      // if(this.equityM?.length > 0){
      //   this.fcfeForm.controls['coeMethod'].setValue(this.equityM[0].type);
      // }
    // }
  // }
}

ngOnInit(): void {
  // if(this.next === 1){
    this.loadFormControl();
    this.checkProcessExist();
    this.loadValues();
    this.loadOnChangeValue();
  // }
}
checkProcessExist(){
if(this.thirdStageInput){
  this.thirdStageInput.map((stateTwoDetails:any)=>{
    if(stateTwoDetails.model === MODELS.FCFE && this.formOneData.model.includes(MODELS.FCFE)){
      this.fcfeForm.controls['discountRate'].setValue(stateTwoDetails?.discountRate) 
      this.fcfeForm.controls['discountingPeriod'].setValue(stateTwoDetails?.discountingPeriod) 
      this.fcfeForm.controls['betaType'].setValue(stateTwoDetails?.betaType) 
      this.selectedSubBetaType = stateTwoDetails?.betaSubType ? stateTwoDetails.betaSubType : BETA_SUB_TYPE[0];
      this.fcfeForm.controls['coeMethod'].setValue(stateTwoDetails?.coeMethod); 
      this.fcfeForm.controls['riskFreeRate'].setValue(stateTwoDetails?.riskFreeRate); 
      let expectedMarketReturnData:any;
      this.modelControl.fcfe.options.expMarketReturnType.options.map((response:any)=>{
        if(response.value ===  stateTwoDetails?.expMarketReturnType){
          expectedMarketReturnData = response
        }
      })
      this.fcfeForm.controls['expMarketReturnType'].setValue(expectedMarketReturnData.name);
      this.fcfeForm.controls['expMarketReturn'].setValue(stateTwoDetails?.expMarketReturn);
      this.fcfeForm.controls['specificRiskPremium'].setValue(stateTwoDetails?.specificRiskPremium); 
      this.fcfeForm.controls['beta'].setValue(stateTwoDetails?.beta);
      this.fcfeForm.controls['riskPremium'].setValue(stateTwoDetails?.riskPremium); 
      this.specificRiskPremiumModalForm.controls['companySize'].setValue(stateTwoDetails?.alpha.companySize)
      this.specificRiskPremiumModalForm.controls['marketPosition'].setValue(stateTwoDetails?.alpha.marketPosition)
      this.specificRiskPremiumModalForm.controls['liquidityFactor'].setValue(stateTwoDetails?.alpha.liquidityFactor)
      this.specificRiskPremiumModalForm.controls['competition'].setValue(stateTwoDetails?.alpha.competition);
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
      });
}

loadOnChangeValue(){
  this.fcfeForm.controls['expMarketReturnType'].valueChanges.subscribe(
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
            this.fcfeForm.controls['expMarketReturn'].patchValue(parseFloat(result?.analystConsensusEstimates))
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.fcfeForm.controls['expMarketReturnType'].setValue('');
          }
        })
        this.calculateCoeAndAdjustedCoe();
      }
      else{
        this.dataReferenceService.getBSE500(expectedMarketReturnData.years,this.formOneData?.valuationDate).subscribe(
          (response) => {
            if (response.status) {
              this.fcfeForm.controls['expMarketReturn'].value = response?.result;
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
    }
  );

  // this.fcfeForm.controls['betaType'].valueChanges.subscribe((val:any) => {
  //   if(!val) return;
  //   const beta = parseFloat(this.formOneData?.betaIndustry?.beta);
  //   if (val == 'levered'){
  //     this.fcfeForm.controls['beta'].setValue(
  //       beta
  //       );
  //     }
  //     else if (val == 'unlevered') {
  //     const deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio)/100
  //     const effectiveTaxRate = parseFloat(this.formOneData?.betaIndustry?.effectiveTaxRate)/100;        
  //     const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
  //     this.fcfeForm.controls['beta'].setValue(
  //       unleveredBeta
  //     );
  //   }
  //   else if (val == 'market_beta') {
  //     this.fcfeForm.controls['beta'].setValue(1);
  //   }
  //   else {
  //     // Do nothing for now
  //   }
  //   this.calculateCoeAndAdjustedCoe();
    
  // });

  this.fcfeForm.controls['riskFreeRate'].valueChanges.subscribe((val:any)=>{
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
          this.fcfeForm.controls['riskFreeRate'].setValue('');
        }
        this.calculateCoeAndAdjustedCoe();
      })
    }
    else{
      this.calculateCoeAndAdjustedCoe();
    }
  })

  this.fcfeForm.controls['coeMethod'].valueChanges.subscribe((value:any)=>{
    if(!value) return;
    this.calculateCoeAndAdjustedCoe();
  })  
}

loadFormControl(){
    this.fcfeForm=this.formBuilder.group({
    discountRate:[null,[Validators.required]],
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
    companySize:['',[Validators.required]],
    marketPosition:['',[Validators.required]],
    liquidityFactor:['',[Validators.required]],
    competition:['',[Validators.required]],
  })
}

getDocList(doc: any) {
  if (this.formOneData?.model.length>0 && this.formOneData?.model.includes('FCFE')) {
    this.fcfeForm.controls['discountRate'].setValue('Cost_Of_Equity');
  } else if (this.formOneData?.model.length>0 && this.formOneData?.model.includes('FCFF')) {
    this.fcfeForm.controls['discountRate'].setValue('Cost_Of_Equity'); //temporary set value as cost of equity ,change later
  }
    return doc.type;
}
 

onSlideToggleChange(event: any) {
  if (event && !this.isDialogOpen) {
    this.isDialogOpen = true;

    const data = {
      data: {
        ...this.specificRiskPremiumModalForm.value,
        value:'specificRiskPremiumForm'
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
  payload['bse500Value']=this.bse500Value;
  payload['betaSubType']=this.selectedSubBetaType

  if(this.fcfeForm.controls['riskFreeRate'].value  === 'customRiskFreeRate'){
    payload['riskFreeRate'] = this.customRiskFreeRate
  }
  // validate formcontrols
  this.validateControls(this.fcfeForm.controls,payload);
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
    riskFreeRate: this.fcfeForm.controls['riskFreeRate'].value === 'customRiskFreeRate' ? this.customRiskFreeRate : this.fcfeForm.controls['riskFreeRate'].value,
    expMarketReturn: this.fcfeForm.controls['expMarketReturn'].value,
    beta: this.fcfeForm.controls['beta']?.value ? this.fcfeForm.controls['beta'].value : 0,
    riskPremium: this.fcfeForm.controls['riskPremium'].value,
    coeMethod: this.fcfeForm.controls['coeMethod'].value,
  };

  this.calculationsService.getCostOfEquity(coePayload).subscribe((response: any) => {
    if (response.status) {
      this.adjCoe = response?.result?.adjCOE;
      this.coe = response?.result?.coe;
      this.apiCallMade = true;
      this.isLoader=false;
    }
  });
  this.isLoader=false;
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
    
    if((current && previous) && current.valuationDate !== previous.valuationDate){
      this.fcfeForm.controls['expMarketReturnType'].setValue('');
      this.fcfeForm.controls['expMarketReturn'].reset();
    }
  }
  if(this.equityM?.length > 0){
    this.fcfeForm.controls['coeMethod'].setValue(this.equityM[0].type);
  }

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
if(event?.target?.value){
  if(event?.target?.value.includes('unlevered') || event?.target?.value.includes('levered')){
    this.calculateBeta(BETA_SUB_TYPE[0]);
  }
  else{
    this.selectedSubBetaType = '';
    this.fcfeForm.controls['beta'].setValue(1);
  }
}
}

calculateBeta(betaSubType:any){
  const betaPayload = {
    industryAggregateList: this.formTwoData.formTwoData.selectedIndustries,
    betaSubType: betaSubType
  }
  this.betaLoader = true
  this.ciqSpService.calculateSPindustryBeta(betaPayload).subscribe((betaData:any)=>{
    if(betaData.status){
      this.betaLoader = false;
      this.fcfeForm.controls['beta'].setValue(betaData.total);
      this.selectedSubBetaType = betaSubType;
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
}

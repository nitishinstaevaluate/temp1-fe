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
  excessEarningForm:any;
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

  @ViewChild(MatStepper, { static: false }) stepper!: MatStepper;
  
constructor(private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar){}
  
ngOnChanges(): void {
  this.formOneData;
}

ngOnInit(): void {
  this.loadFormControl();
  this.loadValues();
  this.loadOnChangeValue();
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
      if(val.value === "Analyst_Consensus_Estimates"){
        const data={
          data: 'ACE',
          width:'30%',
        }
        const dialogRef = this.dialog.open(GenericModalBoxComponent,data);
        dialogRef.afterClosed().subscribe((result)=>{
          if (result) {
            this.excessEarningForm.controls['expMarketReturn'].patchValue(result?.analystConsensusEstimates)
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.excessEarningForm.controls['expMarketReturnType'].reset();
            this.snackBar.open('Expected Market Return Not Saved','OK',{
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
          }
        })
      }
      else{
        this.dataReferenceService
        .getBSE500(
          val?.years,
          this.formOneData?.valuationDate
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.excessEarningForm.controls['expMarketReturn'].value = response?.result;
              this.apiCallMade=false;
            }
            else{
            
            }
          },
          (error) => {
            console.error(error);
          }
          );
      }
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
    else {
      // Do nothing for now
    }
    
  });
  this.subscribeToFormChanges();
}

subscribeToFormChanges() {
  const controlsToWatch = [
    'riskFreeRate',
    'beta',
    'riskPremium',
    'coeMethod',
  ];

  for (const controlName of controlsToWatch) {
    this.excessEarningForm.get(controlName).valueChanges.subscribe(() => {
      this.apiCallMade = false;
    });
  }
}

loadFormControl(){
    this.excessEarningForm=this.formBuilder.group({
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
  this.excessEarningForm.controls['specificRiskPremium'].setValue(event?.checked);
  if(event?.checked){
    const data={
      data: 'specificRiskPremiumForm', //hardcoded for now,store in enum
      width:'50%',
    }
   const dialogRef = this.dialog.open(GenericModalBoxComponent,data);

   dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.specificRiskPremiumModalForm.patchValue(result);
      this.snackBar.open('Specific Risk Premium is added','OK',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
    } else {
      this.excessEarningForm.controls['specificRiskPremium'].reset();
      this.specificRiskPremiumModalForm.reset();
      this.snackBar.open('Specific Risk Premium not saved','OK',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    }
  });
  }
}

saveAndNext(): void {
  
  const payload = {...this.excessEarningForm.value,alpha:this.specificRiskPremiumModalForm.value,status:'Excess_Earnings'}

  payload['expMarketReturnType']=this.excessEarningForm.controls['expMarketReturnType']?.value?.value;
  
  // submit final payload
  this.excessEarnDetails.emit(payload)
  
}

previous(){
  this.excessEarnDetailsPrev.emit({status:'Excess_Earnings'})
}

calculateCoeAndAdjustedCoe() {
  if (this.apiCallMade) {
    // If the API call has already been made, return true immediately.
    return true;
  }
  if (
    !this.excessEarningForm.controls['riskFreeRate'].value ||
    !this.excessEarningForm.controls['expMarketReturn'].value ||
    !this.excessEarningForm.controls['riskPremium'].value ||
    !this.excessEarningForm.controls['coeMethod'].value
    ) {
      return false;
    }
    
  this.isLoader=true
  const coePayload = {
    riskFreeRate: this.excessEarningForm.controls['riskFreeRate'].value,
    expMarketReturn: this.excessEarningForm.controls['expMarketReturn'].value,
    beta: this.excessEarningForm.controls['beta']?.value ? this.excessEarningForm.controls['beta'].value : 0,
    riskPremium: this.excessEarningForm.controls['riskPremium'].value,
    coeMethod: this.excessEarningForm.controls['coeMethod'].value,
  };

  this.dataReferenceService.getCostOfEquity(coePayload).subscribe((response: any) => {
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

}


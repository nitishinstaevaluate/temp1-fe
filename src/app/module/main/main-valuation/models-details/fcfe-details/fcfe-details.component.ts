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
  selector: 'app-fcfe-details',
  templateUrl: './fcfe-details.component.html',
  styleUrls: ['./fcfe-details.component.scss']
})
export class FcfeDetailsComponent implements OnChanges,OnInit{

  modelControl:any = groupModelControl;

  @Output() fcfeDetails=new EventEmitter<any>();
  @Output() fcfeDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  fcfeForm:any;
  specificRiskPremiumModalForm:any;
  floatLabelType:any = 'never';
  discountR: any=[];
  equityM: any=[];
  indianTreasuryY: any=[];

  wacc={
    result: 13.49,
    valuationDate : 'valuationDate',
    message: 'Calculated WACC value',
    status: true
  }

  costOfEquity={
    result: 15.39,
    valuationDate : 'valuationDate',
    message: 'Calculated cost Of Equity value',
    status: true
  }

  adjustedCostOfEquity={
    result: 17.39,
    valuationDate : 'valuationDate',
    message: 'Calculated Adjusted value',
    status: true
  }

  @ViewChild('countElement', { static: false }) countElement!: ElementRef;
  @ViewChild(MatStepper, { static: false }) stepper!: MatStepper;
  
constructor(private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar,
  private builder: AnimationBuilder){}
  
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
      this.indianTreasuryY = resp[DROPDOWN.INDIANTREASURYYIELDS]
    });
}

loadOnChangeValue(){
  this.fcfeForm.controls['expMarketReturnType'].valueChanges.subscribe(
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
            this.fcfeForm.controls['expMarketReturn'].patchValue(result?.analystConsensusEstimates)
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.fcfeForm.controls['expMarketReturnType'].reset();
            this.snackBar.open('Expected Market Return Not Saved','OK',{
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
          }
        })
      }
    }
  );

  this.fcfeForm.controls['betaType'].valueChanges.subscribe((val:any) => {
    if(!val) return;
    const beta = parseFloat(this.formOneData?.betaIndustry?.beta);
    if (val == 'levered'){
      this.fcfeForm.controls['beta'].setValue(
        beta
        );
      }
      else if (val == 'unlevered') {
      const deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio)/100
      const effectiveTaxRate = parseFloat(this.formOneData?.betaIndustry?.effectiveTaxRate)/100;        
      const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
      this.fcfeForm.controls['beta'].setValue(
        unleveredBeta
      );
    }
    else {
      // Do nothing for now
    }
    
  });
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
    beta:['',[Validators.required]]
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
    this.fcfeForm.controls['discountRate'].setValue('Cost_Of_Equity');
  } else if (this.formOneData?.model.length>0 && this.formOneData?.model.includes('FCFF')) {
    this.fcfeForm.controls['discountRate'].setValue('Cost_Of_Equity'); //temporary set value as cost of equity ,change later
  }
    return doc.type;
}

onSlideToggleChange(event:any){
  console.log(event,"event value")
  this.fcfeForm.controls['specificRiskPremium'].setValue(event?.checked);
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
      this.fcfeForm.controls['specificRiskPremium'].reset();
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
  
  const payload = {...this.fcfeForm.value,specficRiskPremium:this.specificRiskPremiumModalForm.value,status:'FCFE'}


  // check if expected market return  is empty or not
  if (!this.fcfeForm.controls['expMarketReturn'].value) {
    this.dataReferenceService
      .getBSE500(
        this.fcfeForm.controls['expMarketReturnType'].value.years,
        this.formOneData?.valuationDate
      )
      .subscribe(
        (response) => {
          if (response.status) {
            payload['expMarketReturn'] = response?.result;
            payload['expMarketReturnType']=this.fcfeForm.controls['expMarketReturnType']?.value?.value;
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }
  
  
  // submit final payload
  this.fcfeDetails.emit(payload)
}

previous(){
  this.fcfeDetailsPrev.emit({status:'FCFE'})
}




}

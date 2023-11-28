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

  @ViewChild('countElement', { static: false }) countElement!: ElementRef;
  @ViewChild(MatStepper, { static: false }) stepper!: MatStepper;
  
constructor(private valuationService:ValuationService,
  private dataReferenceService: DataReferencesService,
  private formBuilder:FormBuilder,
  private dialog:MatDialog,
  private snackBar:MatSnackBar,
  private calculationsService:CalculationsService){}
  
ngOnChanges(changes:SimpleChanges): void {
  this.formOneData;
  if (changes['formOneData']) {
    const current = changes['formOneData'].currentValue;
    const previous = changes['formOneData'].previousValue;
    if((current && previous) && current.industry !== previous.industry){
      this.fcfeForm.controls['betaType'].setValue('');
      this.fcfeForm.controls['beta'].reset();
    }
    if((current && previous) && current.valuationDate !== previous.valuationDate){
      this.fcfeForm.controls['expMarketReturnType'].setValue('');
      this.fcfeForm.controls['expMarketReturn'].reset();
    }
  }
  if(this.equityM?.length > 0){
    this.fcfeForm.controls['coeMethod'].setValue(this.equityM[0].type);
  }
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
            this.fcfeForm.controls['expMarketReturn'].patchValue(parseInt(result?.analystConsensusEstimates))
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.fcfeForm.controls['expMarketReturnType'].setValue('');
            // this.snackBar.open('Expected Market Return Not Saved','OK',{
            //   horizontalPosition: 'right',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   panelClass: 'app-notification-error'
            // })
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
              this.fcfeForm.controls['expMarketReturn'].value = response?.result;
              this.apiCallMade=false;
              this.bse500Value=response?.close?.Close.toFixed(2);
            }
            else{
            
            }
          },
          (error) => {
            console.error(error);
            
          }
          );
      }
      this.calculateCoeAndAdjustedCoe()
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
    else if (val == 'market_beta') {
      this.fcfeForm.controls['beta'].setValue(1);
    }
    else {
      // Do nothing for now
    }
    this.calculateCoeAndAdjustedCoe();
    
  });

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
        // this.specificRiskPremiumModalForm.reset();
        // this.snackBar.open('Specific Risk Premium not saved', 'OK', {
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   panelClass: 'app-notification-error',
        // });
        this.calculateCoeAndAdjustedCoe();
      }
    });
  }
}

saveAndNext(): void {
  const payload = {...this.fcfeForm.value,alpha:this.specificRiskPremiumModalForm.value,status:'FCFE'};
  payload['expMarketReturnType']=this.fcfeForm.controls['expMarketReturnType']?.value?.value;
  payload['adjustedCostOfEquity']=this.adjCoe;
  payload['costOfEquity']=this.coe;
  payload['bse500Value']=this.bse500Value;

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
      localStorage.setItem('stepTwoStats',`false`);
    }
    else{
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && formStat.includes('1')){
        const splitFormStatus = formStat.split(',');
        splitFormStatus.splice(splitFormStatus.indexOf('1'),1);
        localStorage.setItem('pendingStat',`${splitFormStatus}`);
        if(splitFormStatus.length>1){
          localStorage.setItem('stepTwoStats',`false`);
          
        }else{
        localStorage.setItem('stepTwoStats',`true`);
        localStorage.removeItem('pendingStat');
        }
      }
      else if (formStat !== null && !formStat.includes('1')){
        localStorage.setItem('stepTwoStats',`false`);
      }
      else{
        localStorage.setItem('stepTwoStats',`true`);
        
    }
    }

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
}

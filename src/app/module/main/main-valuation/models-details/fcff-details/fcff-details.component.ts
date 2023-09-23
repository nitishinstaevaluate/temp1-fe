import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { CalculationsService } from 'src/app/shared/service/calculations.service';

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
  

  fcffForm:any;
  specificRiskPremiumModalForm:any;
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
  adjCoe:number=0;
  coe:number=0;
  wacc:number=0;
  apiCallMade = false;
  isLoader = false;
  isDialogOpen = false; 
  
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
      this.fcffForm.controls['betaType'].reset();
      this.fcffForm.controls['beta'].reset();
    }
    if((current && previous) && current.valuationDate !== previous.valuationDate){
      this.fcffForm.controls['expMarketReturnType'].reset();
      this.fcffForm.controls['expMarketReturn'].reset();
    }
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
      this.cStructure = resp[0][DROPDOWN.CAPTIAL_STRUCTURE],
      this.rPremium = resp[0][DROPDOWN.PREMIUM];
    });
}

loadOnChangeValue(){
  this.fcffForm.controls['expMarketReturnType'].valueChanges.subscribe(
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
            this.fcffForm.controls['expMarketReturn'].patchValue(parseInt(result?.analystConsensusEstimates))
            this.snackBar.open('Analyst Estimation Added','OK',{
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
          } else {
            this.fcffForm.controls['expMarketReturnType'].reset();
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
              this.fcffForm.controls['expMarketReturn'].value = response?.result;
              
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

  this.fcffForm.controls['capitalStructureType'].valueChanges.subscribe(
    (val:any) => {
      if(!val) return;
      if (val == 'Industry_Based') {
        this.debtRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio)/100;
        this.totalCapital = 1 + this.debtRatio;
        this.debtProp = this.debtRatio/this.totalCapital;
        this.equityProp = 1 - this.debtProp;
        this.prefProp = 1 - this.debtProp - this.equityProp;
        // });
      } else {
        // this.anaConEst = null;
      }
    }
  );

  this.fcffForm.controls['betaType'].valueChanges.subscribe((val:any) => {
    if(!val) return;
    const beta = parseFloat(this.formOneData?.betaIndustry?.beta);
    if (val == 'levered'){
      this.fcffForm.controls['beta'].setValue(
        beta
        );
      }
      else if (val == 'unlevered') {
      const deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio)/100
      const effectiveTaxRate = parseFloat(this.formOneData?.betaIndustry?.effectiveTaxRate)/100;        
      const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
      this.fcffForm.controls['beta'].setValue(
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
    'copShareCapital',
    'costOfDebt'
  ];

  for (const controlName of controlsToWatch) {
    this.fcffForm.get(controlName).valueChanges.subscribe(() => {
      this.apiCallMade = false;
    });
  }
}

loadFormControl(){
    this.fcffForm=this.formBuilder.group({
    discountRate:[null,[Validators.required]],
    discountingPeriod:['',[Validators.required]],
    betaType:['',[Validators.required]],
    coeMethod:['',[Validators.required]],
    riskFreeRate:['',[Validators.required]],
    expMarketReturnType:['',[Validators.required]],
    expMarketReturn:['',[Validators.required]],
    specificRiskPremium:[false,[Validators.required]],
    beta:['',[Validators.required]],
    capitalStructureType:['',[Validators.required]],
    costOfDebt:['',[Validators.required]],
    riskPremium:['',[Validators.required]],
    copShareCapital:['',[Validators.required]],
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
    this.fcffForm.controls['discountRate'].setValue('Cost_Of_Equity');
  } else if (this.formOneData?.model.length>0 && this.formOneData?.model.includes('FCFF')) {
    this.fcffForm.controls['discountRate'].setValue('Cost_Of_Equity'); //temporary set value as cost of equity ,change later
  }
    return doc.type;
}

onSlideToggleChange(event:any){
  if(event && !this.isDialogOpen){
    this.isDialogOpen = true;

    const data={
      data: 'specificRiskPremiumForm', //hardcoded for now,store in enum
      width:'50%',
    }
   const dialogRef = this.dialog.open(GenericModalBoxComponent,data);

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
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
    } else {
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
  
  const payload = {...this.fcffForm.value,alpha:this.specificRiskPremiumModalForm.value,status:'FCFF'}

  if (this.fcffForm.controls['capitalStructureType'].value == 'Industry_based') {
    let capitalStructure = {
      capitalStructureType : 'Industry_Based',
      debtProp : this.debtRatio,
      equityProp : this.equityProp,
      totalCapital : this.totalCapital
    }
    payload['capitalStructure'] = capitalStructure;
  }
  // check if expected market return  is empty or not
 
  payload['expMarketReturnType']=this.fcffForm.controls['expMarketReturnType']?.value?.value;
  this.fcffDetails.emit(payload)
  
  // submit final payload
}

previous(){
  this.fcffDetailsPrev.emit({status:'FCFE'})
}


calculateCoeAndAdjustedCoe() {
  if (this.apiCallMade) {
    // If the API call has already been made, return true immediately.
    return true;
  }
  if (
    !this.fcffForm.controls['riskFreeRate'].value ||
    !this.fcffForm.controls['expMarketReturn'].value ||
    !this.fcffForm.controls['riskPremium'].value ||
    !this.fcffForm.controls['coeMethod'].value ||
    !this.fcffForm.controls['copShareCapital'].value ||
    !this.fcffForm.controls['costOfDebt'].value
    ) {
      return false;
    }
    
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
      const waccPayload={
        adjCoe:response?.result?.adjCOE,
        equityProp:this.equityProp,
        costOfDebt:this.fcffForm.controls['costOfDebt'].value,
        taxRate:this.formOneData?.taxRate,
        debtProp:this.debtProp,
        copShareCapital:this.fcffForm.controls['copShareCapital'].value,
        prefProp:this.prefProp,
        coeMethod:response?.result?.coe
      }
      this.calculationsService.getWacc(waccPayload).subscribe((data:any)=>{
        if(data.status){
          this.adjCoe = response?.result?.adjCOE;
          this.coe = response?.result?.coe;
          this.wacc = data?.result?.wacc;
          // Set the flag to true to indicate that the API call has been made.
          this.apiCallMade = true;
          this.isLoader=false;
        }
      })
    }
  });
  this.isLoader=false;
  // Always return false the first time to prevent the template from displaying prematurely.
  return false;
}

}

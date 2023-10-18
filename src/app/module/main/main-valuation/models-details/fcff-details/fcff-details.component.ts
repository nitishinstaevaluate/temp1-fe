import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  

  fcffForm:any=FormGroup;
  specificRiskPremiumModalForm:any=FormGroup;
  floatLabelType:any = 'never';
  targetCapitalStructureForm:any=FormGroup;
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
  if(this.equityM?.length > 0){
    this.fcffForm.controls['coeMethod'].setValue(this.equityM[0].type);
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
      this.cStructure.push({type:'Target_Based',label:'Target Capital Structure'});
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
  this.fcffForm.controls['capitalStructureType'].valueChanges.subscribe(
    (val:any) => {
      if(!val) return;
      if (val == 'Industry_Based' || val === 'Company_Based') {
        // this.deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio);
        // this.debtProp = this.debtRatio/this.totalCapital;
        // this.equityProp = 1 - this.debtProp;
        // this.prefProp = 1 - this.debtProp - this.equityProp;
        // this.totalCapital = 1 + this.debtRatio;
        this.deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio);
        this.debtProp = null;
        this.equityProp = null;
        this.prefProp = null;
        this.totalCapital = null;
        this.getWaccIndustryOrCompanyBased();
      } else {
        const data={
          data: 'targetCapitalStructure',
          width:'60%',
        }
        const dialogRef = this.dialog.open(GenericModalBoxComponent,data);

        dialogRef.afterClosed().subscribe((result)=>{
          if(result){
            this.targetCapitalStructureForm.setValue(result);

            this.deRatio = parseFloat(this.formOneData?.betaIndustry?.deRatio);
            this.debtProp = +this.targetCapitalStructureForm.controls['debtProportion'].value;
            this.equityProp = +this.targetCapitalStructureForm.controls['equityProportion'].value;
            this.prefProp = +this.targetCapitalStructureForm.controls['preferenceProportion'].value;
            this.totalCapital = +this.targetCapitalStructureForm.controls['totalCapital'].value;

            this.snackBar.open('Target Capital Structure saved','Ok',{
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-success'
            })
            this.calculateCoeAndAdjustedCoe();

          }
          else {
            this.fcffForm.controls['capitalStructureType'].reset();

            this.snackBar.open('Target Capital Structure Not Saved','OK',{
              horizontalPosition: 'center',
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
    else if (val == 'market_beta') {
      this.fcffForm.controls['beta'].setValue(1);
    }
    else {
      // Do nothing for now
    }
    this.calculateCoeAndAdjustedCoe()
    
  });
  this.fcffForm.controls['copShareCapital'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    this.calculateCoeAndAdjustedCoe();
  })
  this.fcffForm.controls['costOfDebt'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    this.calculateCoeAndAdjustedCoe();
  })
  this.fcffForm.controls['coeMethod'].valueChanges.subscribe((val:any)=>{
    if(!val) return;
    this.calculateCoeAndAdjustedCoe();
  })

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

  this.targetCapitalStructureForm=this.formBuilder.group({
    equityProportion:['',[Validators.required]],
    debtProportion:['',[Validators.required]],
    preferenceProportion:['',[Validators.required]],
    totalCapital:['',[Validators.required]],
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
      this.calculateCoeAndAdjustedCoe()
    } else {
      this.specificRiskPremiumModalForm.reset();
      this.snackBar.open('Specific Risk Premium not saved','OK',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
      this.calculateCoeAndAdjustedCoe()
    }
  });
  }
}

saveAndNext(): void {
  
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
  // check if expected market return  is empty or not
 
  payload['expMarketReturnType']=this.fcffForm.controls['expMarketReturnType']?.value?.value;
  this.fcffDetails.emit(payload)
  
  // submit final payload
}

previous(){
  this.fcffDetailsPrev.emit({status:'FCFE'})
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
    console.log(response,"response")
    if (response.status) {
      console.log(this.deRatio,"de ratio",this.equityProp,"equity prop",this.debtRatio,"deb rattio",this.prefProp,"pref prop",this.totalCapital,"toal cap")

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
      taxRate:this.formOneData?.taxRate.includes('%') ? parseFloat(this.formOneData?.taxRate.replace("%", "")) : this.formOneData?.taxRate,
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
      taxRate:this.formOneData?.taxRate.includes('%') ? parseFloat(this.formOneData?.taxRate.replace("%", "")) : this.formOneData?.taxRate,
    }
    this.calculationsService.getWaccIndustryOrCompanyBased(payload).subscribe((response:any)=>{
      if(response.status){
        this.adjCoe = response?.result?.adjCOE;
        this.wacc = response?.result?.wacc;
      }
    })
  }
 
}
}

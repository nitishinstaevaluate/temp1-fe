import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';

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
  
  // loadForm(){
  //   this.fcffForm=this.formBuilder.group({
  //     costOfDebt:['',[Validators.required]]
  //   })
  // }

  fcffForm:any;
  specificRiskPremiumModalForm:any;
  floatLabelType:any = 'never';
  discountR: any=[];
  equityM: any=[];
  indianTreasuryY: any=[];
  cStructure:any=[];
  debtRatio: any;
  totalCapital: any;
  debtProp: any;
  equityProp: any;
  
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
      this.cStructure = resp[0][DROPDOWN.CAPTIAL_STRUCTURE]
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
            this.fcffForm.controls['expMarketReturn'].patchValue(result?.analystConsensusEstimates)
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
      
    }
  );

  this.fcffForm.controls['capitalStructureType'].valueChanges.subscribe(
    (val:any) => {
      if(!val) return;
      if (val == 'Industry_Based') {
        this.debtRatio = parseFloat(this.formOneData?.betaindustry?.deRatio)/100;
        this.totalCapital = 1 + this.debtRatio;
        this.debtProp = this.debtRatio/this.totalCapital;
        this.equityProp = 1 - this.debtProp;
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
  this.fcffForm.controls['specificRiskPremium'].setValue(event?.checked);
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
      this.fcffForm.controls['specificRiskPremium'].reset();
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
  
  const payload = {...this.fcffForm.value,specficRiskPremium:this.specificRiskPremiumModalForm.value,status:'FCFF'}


  // check if expected market return  is empty or not
  if (!this.fcffForm.controls['expMarketReturn'].value) {
    this.dataReferenceService
      .getBSE500(
        this.fcffForm.controls['expMarketReturnType'].value.years,
        this.formOneData?.valuationDate
      )
      .subscribe(
        (response) => {
          if (response.status) {
            payload['expMarketReturn'] = response?.result;
            payload['expMarketReturnType']=this.fcffForm.controls['expMarketReturnType']?.value?.value;
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }
  
  
  // submit final payload
  this.fcffDetails.emit(payload)
}

previous(){
  this.fcffDetailsPrev.emit({status:'FCFE'})
}

}

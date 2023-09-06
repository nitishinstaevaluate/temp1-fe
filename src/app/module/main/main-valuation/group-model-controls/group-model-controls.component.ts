import { Component, EventEmitter, Output,OnInit, ChangeDetectorRef, Input,OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { GET_TEMPLATE, isSelected, toggleCheckbox } from 'src/app/shared/enums/functions';


@Component({
  selector: 'app-group-model-controls',
  templateUrl: './group-model-controls.component.html',
  styleUrls: ['./group-model-controls.component.scss']
})
export class GroupModelControlsComponent implements OnInit {
  // decorators declaration
  @Output() saveAndNextEvent = new EventEmitter<void>();
  @Output() groupModelControls = new EventEmitter<any>();
  @Input() currentStepIndex: any;

  // form declaration
  modelControl:any = groupModelControl;
  modelValuation: FormGroup;
  specifyFSDetails: FormGroup;
  form: FormGroup;
  modelSpecificCalculation:FormGroup;
  waccCalculation:FormGroup;
  relativeValuation:FormGroup;
  hasError= hasError;

// array declaration
  inputs = [{}];
  checkedItems:any=[];
  selectedPreferenceItems:any=[];
  files: any = [];
  industries:any=[];
  subIndustries: any[] = [];
  preferenceCompanies:any=[];
  prefrerenceIndustries:any=[
    {
      industry:"steel",
      _id:0
    },
    {
      industry:"auto",
      _id:1
    },
    {
      industry:"car",
      _id:2
    }
  ];
  
  // property declaration
  industriesRatio: any = '';
  betaIndustriesId: any = '';
  floatLabelType:any = 'never';
  isDragged=false;
  valuationM: any;
  taxRate: any;
  discountR: any;
  terminalgrowthRate: any;
  equityM: any;
  riskF: any;
  marketE: any;
  betaS: any;
  rPremium: any;
  preShaCap: any;
  debt: any;
  cStructure: any;
  pppShareCaptial: any;
  indianTreasuryY: any;
  historicalReturns: any;
  debtRatio: any;
  totalCapital: any;
  debtProp: any;
  equityProp:any;
  newDate: any;
  discountRateSelection: any;

  constructor(private formBuilder: FormBuilder,
    private valuationService: ValuationService,
    private _dataReferencesService: DataReferencesService,
    private cdr:ChangeDetectorRef) {
    this.form=this.formBuilder.group({});
    this.inputs.forEach((_, i) => {
      this.form.addControl('select' + i, new FormControl(''));
    });

    this.modelValuation=this.formBuilder.group({
      company:['',[Validators.required]],
      valuationDate:['',[Validators.required]],
      projectionYears:['',[Validators.required]],
      projectionYearSelect:['',[Validators.required]],
      industry:['',[Validators.required]],
      subIndustry:['',[Validators.required]],
      model:[false,[Validators.required]],
      userId: ['641d654fa83ed4a5f0293a52', Validators.required],
      excelSheetId:['',[Validators.required]],
      type: ['industry', Validators.required],
    })
    this.specifyFSDetails=this.formBuilder.group({
      outstandingShares:['',[Validators.required]],
      taxRateType:['',[Validators.required]],
      terminalGrowthRate:['',[Validators.required]]
    })
    this.modelSpecificCalculation=this.formBuilder.group({
      discountRate:[null,[Validators.required]],
      discountingPeriod:['',[Validators.required]],
      betaType:['',[Validators.required]],
      coeMethod:['',[Validators.required]],
      riskFreeRate:['',[Validators.required]],
      expMarketReturnType:['',[Validators.required]],
      expMarketReturn:['',[Validators.required]],
      otherAdj:['',[Validators.required]],
      beta:['',[Validators.required]]
    })
    this.waccCalculation=this.formBuilder.group({
      riskPremium:['',[Validators.required]],
      capitalStructureType:['',[Validators.required]],
      copShareCapital:['',[Validators.required]],
      costOfDebt:['',[Validators.required]]
    })
    this.relativeValuation=this.formBuilder.group({
      preferenceRatioSelect:['',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([]),

    })
  }
  // Initiate form data 
  get Companies() {
    return this.relativeValuation.controls['companies'] as FormArray;
  }
  get Industries() {
    return this.relativeValuation.controls['industries'] as FormArray;
  }
  removeField(i: any) {
    this.Companies.controls.splice(i, 1);
  }
  addInput() {
    this.Companies.push(new FormControl(null));
  }
  removeFieldIndustry(i: any) {
   this.Industries.controls.splice(i,1)
  }
  addInputIndustry() {
    this.Industries.push(new FormControl(null));
  }

  ngOnInit(){
    this.formLoad();
   this.loadValues();
      this.addInput();
      this.addInputIndustry();
  }
  loadValues(){
    forkJoin([this.valuationService.getValuationDropdown(),this._dataReferencesService.getIndianTreasuryYields(),
      this._dataReferencesService.getHistoricalReturns(),
      this._dataReferencesService.getBetaIndustries()
    ])
      .subscribe((resp: any) => {
        this.industries = resp[0][DROPDOWN.INDUSTRIES];
        this.valuationM = resp[0][DROPDOWN.MODAL];
        this.taxRate = resp[0][DROPDOWN.TAX];
        this.discountR = resp[0][DROPDOWN.DISCOUNT];
        this.terminalgrowthRate = resp[0][DROPDOWN.GROWTH];
        this.equityM = resp[0][DROPDOWN.EQUITY];
        this.riskF = resp[0][DROPDOWN.RISK];
        this.marketE = resp[0][DROPDOWN.EMARKET];
        this.betaS = resp[0][DROPDOWN.BETA];
        this.rPremium = resp[0][DROPDOWN.PREMIUM];
        this.preShaCap = resp[0][DROPDOWN.PREFERANCE_SHARE_CAPITAL];
        this.debt = resp[0][DROPDOWN.DEBT];
        this.cStructure = resp[0][DROPDOWN.CAPTIAL_STRUCTURE];
        this.pppShareCaptial = resp[0][DROPDOWN.P_P_SHARE_CAPTIAL]; // Spell Error
        this.indianTreasuryY = resp[DROPDOWN.INDIANTREASURYYIELDS]; // Set as array element 1
        this.historicalReturns = resp[DROPDOWN.HISTORICALRETURNS]; // Set as array element 2
        this.betaIndustriesId = resp[DROPDOWN.BETAINDUSTRIES]; // Set as array element 3
        // this.industriesRatio = resp[DROPDOWN.INDUSTRIESRATIO]; //Set as array element 4
  
      });
  }
  formLoad(){
// Initiate form change detectors
    this.modelValuation.controls['industry'].valueChanges.subscribe((val) => {
      if (!val) {
        this.subIndustries = [];
        return;
      }
      const indst = this.industries.find((e:any) => e.industry == val);
      this.valuationService.getIndustries(indst._id).subscribe((resp: any) => {
        this.subIndustries = resp;
      });
      this._dataReferencesService.getIndustriesRatio(indst._id).subscribe((resp: any) => {
        this.industriesRatio = resp[0];
      });
  
    });

    this.waccCalculation.controls['capitalStructureType'].valueChanges.subscribe(
      (val) => {
        if(!val) return
        if (val == 'Industry_Based') {
          this.debtRatio = parseFloat(this.betaIndustriesId.deRatio)/100;
          this.totalCapital = 1 + this.debtRatio;
          this.debtProp = this.debtRatio/this.totalCapital;
          this.equityProp = 1 - this.debtProp;
          // });
        } else {
          // this.anaConEst = null;
        }
      }
    );

    this.modelSpecificCalculation.controls['betaType'].valueChanges.subscribe((val) => {
      if(!val) return;
      if (val == 'levered'){
        
        const beta = parseFloat(this.betaIndustriesId.beta)
        this.modelSpecificCalculation.controls['beta'].setValue(
          beta
          );
        }
        else if (val == 'unlevered') {
        const beta = parseFloat(this.betaIndustriesId.beta)
        const deRatio = parseFloat(this.betaIndustriesId.deRatio)/100
        const effectiveTaxRate = parseFloat(this.betaIndustriesId.effectiveTaxRate)/100;        
        const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
        this.modelSpecificCalculation.controls['beta'].setValue(
          unleveredBeta
        );
      }
      else {
        // Do nothing for now
      }
      
    });

    

    this.modelSpecificCalculation.controls['expMarketReturnType'].valueChanges.subscribe(
      (val) => {
        if(!val) return
        this.modelSpecificCalculation.controls['expMarketReturn'].setValue(
          val
        );
      }
    );

  }
  isRelativeValuation(){
    return !!this.checkedItems.includes('Relative_Valuation');

  }

  isSelected(value: any): boolean {
    var value:any= isSelected(value,this.checkedItems);
    this.modelValuation.controls['model'].setValue(value);
    return value
   
  }

  toggleCheckbox(option:any) {
   this.checkedItems=toggleCheckbox(option['value'],this.checkedItems);
}
isSelectedpreferenceRatio(value:any){
  return isSelected(value,this.selectedPreferenceItems)
 
}

  saveAndNext(): void {
    this.modelValuation.controls['model'].setValue(this.checkedItems);
    
    const payload = {
      ...this.modelValuation.value,
      ...this.modelSpecificCalculation.value,
      ...this.specifyFSDetails.value,
      ...this.relativeValuation.value,
      ...this.waccCalculation.value
    }
    if (this.isRelativeValuation()) {
      payload['industries'] = this.industriesRatio;
    }
    
    let capitalStructure = {
      capitalStructureType : 'Industry_Based',
      debtProp : this.debtRatio,
      equityProp : this.equityProp,
      totalCapital : this.totalCapital
    }
    if (payload['taxRate'] == null) {
      payload['taxRate'] = '25.17%';
    }
    if (this.waccCalculation.controls['capitalStructureType'].value == 'Industry_based') {
      payload['capitalStructure'] = capitalStructure;
    }
    const valuationDate = this.modelValuation.get('valuationDate')?.value;
    // if (valuationDate) {
      const myDate = {
        year: valuationDate.getFullYear(),
        month: valuationDate.getMonth() + 1, // Note that months are zero-based
        day: valuationDate.getDate(),
      };

    this.newDate = new Date(myDate.year, myDate.month - 1, myDate.day);
    payload['valuationDate'] = this.newDate.getTime();
    console.log(payload)
    this.valuationService.submitForm(payload).subscribe(
      (res: any) => {
        // this.reportId = res.reportId;
        if (!this.isRelativeValuation ) {
          const objs = Object.keys(res.valuationData[0]);
          // for (let index = 0; index < objs.length; index++) {
            //   const data = res.valuationData.map((e: any) => e[objs[index]]);
            //   this.valuationDataReport.push(data);
            // }
          } else {
          }
        },
        (err: any) => {
          console.log(err);
          // this.errorMsg = err.error.message.message;
        }
        );
        this.groupModelControls.emit(payload)
  }
  
  get isDownload() {
    return this.modelValuation.controls['projectionYears'].value ? true : false;
  }

  get downloadTemplate() {
  return GET_TEMPLATE(this.modelValuation.controls['projectionYears'].value);
  }

  onFileSelected(event: any) {
    if (event && event.target.files && event.target.files.length > 0) {
      this.files = event.target.files;
    }
    if (this.files.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.files[0]);
    this.valuationService.fileUpload(formData).subscribe((res: any) => {
      this.modelValuation.get('excelSheetId')?.setValue(res.excelSheetId);
    });
  }
 
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  subIndustryChange(val:any){
    if(val){
      this.valuationService.getCompanies(val).subscribe((resp: any) => {
        if(resp.length>0){
          this.preferenceCompanies = resp;
        }
        else{
          this.preferenceCompanies=[{company:'No company Found',_id:0}];
        }
      });
    }
    else{
      this.preferenceCompanies=[];
    }
  }
  checkPreferenceCompany(){
    return this.Companies.controls.length === this.preferenceCompanies.length  ? false :true
  }

  getDocList(doc: any) {
    if (this.checkedItems.length>0 && this.checkedItems.includes('FCFE')) {
      this.modelSpecificCalculation.controls['discountRate'].setValue('Cost_Of_Equity');
    } else if (this.checkedItems.length>0 && this.checkedItems.includes('FCFF')) {
      this.modelSpecificCalculation.controls['discountRate'].setValue('WACC');
    }
      return doc.type;
  }

}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { FCFF_HEADING_OBJ,FCFE_HEADING_OBJ } from 'src/app/shared/enums/constant';
import { MatStepper } from '@angular/material/stepper';
import { UserInputComponent } from 'src/app/shared/Modal/user-input.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RelativeComponent } from 'src/app/shared/Modal/relative/relative.component';

@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ValuationComponent implements OnInit {
  errorMsg: any = '';
  industries: any[] = [];
  companies: any[] = [];
  valuationM: any[] = [];
  taxR: any[] = [];
  discountR: any[] = [];
  growthR: any[] = [];
  equityM: any[] = [];
  riskF: any[] = [];
  marketE: any[] = [];
  betaS: any[] = [];
  rPremium: any[] = [];
  preShaCap: any[] = [];
  debt: any[] = [];
  cStructure: any[] = [];
  pppShareCaptial: any[] = [];
  indianTreasuryY: any[] = [];
  historicalReturns: any[] = [];
  betaIndustries: any[] =[];
  EnteredTaXRate: any = '';
  modalTitle: any = '';
  riskRate: any = '';
  reportId: any;
  debtRatio: any = '';
  debtProp: any = '';
  equityProp: any = '';
  totalCapital: any = '';
  // newValDate: any = '';
  newDate: any = '';
  valuationDataReport: any[] = [];
  fcfeTableHeading = Object.values(FCFE_HEADING_OBJ);
  fcffTableHeading = Object.values(FCFF_HEADING_OBJ);
  anaConEst: any = '';
  expMarketReturn: any = '';
  companyAverage: any = {
    peRatio: 0,
    pbRatio: 0,
    ebitda: 0,
    sales: 0,
  };
  companyMedian: any = {
    peRatio: 0,
    pbRatio: 0,
    ebitda: 0,
    sales: 0,
  };

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  item: any;
  isEditable = true;

  files: File[] = [];
  subIndustries: any[] = [];
  industriesRatio: any = '';
  betaIndustriesId: any = '';
  relativeFormGroup!: FormGroup;
  

  constructor(
    private _formBuilder: FormBuilder,
    private _valuationService: ValuationService,
    private _dataReferencesService: DataReferencesService,
    private modalService: NgbModal
  ) {
    this.generateForm();
  }
  ngOnInit(): void {
    this.inItData();
    
    // console.log(this.tableHeading);
  }

  returnType(val: any) {
    // number or string
    return typeof(val);
  }

  generateForm() {
    this.firstFormGroup = this._formBuilder.group({
      valuationDate: [''],                                      // removed required field
      company: ['', Validators.required],
      industry: ['', Validators.required],
      projectionYears: [''],                                     // removed as required field
      model: ['', Validators.required],
      userId: ['641d654fa83ed4a5f0293a52', Validators.required],  // Change this to actual userid
      subIndustry: [''],                                          // removed as required field
      discountRateType: ['WACC'],                                  // removed as required field
      discountRateValue: [20],                                     // removed as required field
    });

    this.secondFormGroup = this._formBuilder.group({
      outstandingShares: ['', Validators.required],
      taxRateType: ['Default'], 
      taxRate :['25.17'],
      terminalGrowthRate: [''],
      excelSheetId: ['', Validators.required],
      companies: this._formBuilder.array([]),
      type: ['industry', Validators.required],
    });
    this.addCompany();
    this.addCompany();
    this.addCompany();                                            // improve logic to include n no. of comapnies dynamically
    

    this.thirdFormGroup = this._formBuilder.group({
      discountRate: ['', Validators.required],
      discountingPeriod: ['', Validators.required],
      coeMethod: ['', Validators.required],
      riskFreeRateType: [''],                                       // removed as required field
      riskFreeRateYear: [''],
      riskFreeRate: [''],
      expMarketReturnType: ['', Validators.required],
      expMarketReturn:[''],
      beta: [''],
      betaType: [''],
      riskPremium: ['2'],                                            // checkwhether required any more or not
      copShareCapitalType: [''],
      copShareCapital:[''],
      costOfDebt: [''],
      costOfDebtType: [''],
      capitalStructureType: [''],
      popShareCapitalType:[""],
      otherAdj:[0]
    });

    this.relativeFormGroup = this._formBuilder.group({});
    this.fourthFormGroup = this._formBuilder.group({
      type: ['', Validators.required],
    });

    this.secondFormGroup.controls['taxRateType'].valueChanges.subscribe(
      (val) => {
        if (val) {                   // Write a way to change this value dymanically
          this.modalTitle = val;
          const modalRef = this.modalService.open(UserInputComponent);
          modalRef.componentInstance.modalTitle = val;
          modalRef.result.then((vals: any) => {
            this.EnteredTaXRate = vals;
            this.secondFormGroup.controls['taxRate'].patchValue(vals)
          });
        }
      }
    );

    this.firstFormGroup.controls['industry'].valueChanges.subscribe((val) => {
      // this.getIndustriesbyId(val);
      if (!val) {
        // this.companies = [];
        this.subIndustries = [];
        // this.industriesRatio = [];
        return;
      }
      const indst = this.industries.find((e) => e.industry == val);
      this._valuationService.getIndustries(indst._id).subscribe((resp: any) => {
        // console.log(resp);   
        this.subIndustries = resp;
      });
      // console.log(indst._id);
      this._dataReferencesService.getIndustriesRatio(indst._id).subscribe((resp: any) => {
        this.industriesRatio = resp[0];
      });

      this._dataReferencesService.getBetaIndustriesById(indst._id).subscribe((resp: any) => {
        this.betaIndustriesId = resp;
      });

    });

    this.firstFormGroup.controls['subIndustry'].valueChanges.subscribe(
      (val) => {
        if (!val) {
          this.companies = [];
          return;
        }
        // this.getIndustriesbyId(val);
        // if (!val) {
        //   this.subIndustries = [];
        //   return;
        // }
        // const id = this.companies.find((e) => e.subIndustry == val)._id;
        this._valuationService.getCompanies(val).subscribe((resp: any) => {
          // console.log(resp);
          this.companies = resp;
          this.Companies.controls[0].patchValue(this.companies[0]?._id);
          this.Companies.controls[1].patchValue(this.companies[1]?._id);
          this.Companies.controls[2].patchValue(this.companies[2]?._id);

          // const allPeRatio = this.companies.map((c: any) => c.peRatio);
          // const allPbRatio = this.companies.map((c: any) => c.pbRatio);
          // const allebitda = this.companies.map((c: any) => c.ebitda);
          // const allsales = this.companies.map((c: any) => c.sales);

          this.findAverage('peRatio');
          this.findAverage('pbRatio');
          this.findAverage('ebitda');
          this.findAverage('sales');

          this.findMedian('peRatio');
          this.findMedian('pbRatio');
          this.findMedian('ebitda');
          this.findMedian('sales');
        });
      }
    );
    // let obj = {
    //   valutionDate: 1682706600000,
    //   company: 'nhhhg',
    //   industry: 'Cement- North India',
    //   projectionYear: '12',
    //   model: 'FCFF',
    //   userId: '641d654fa83ed4a5f0293a52',
    //   outstandingShares: '12',
    //   taxRateType: 'Normal_Tax_Rate',
    //   discountRate: 'Cost of Equity',
    //   terminalGrowthRate: 5,
    //   discountingPeriod: 'Full_Period',
    //   coeMethod: 'CAPM',
    //   riskFreeRateType: '30_year',
    //   expMarketReturnType: 'ACE',
    //   excelSheetId: '1681734372560-FCFE Input Sheet with Formula (1).xlsx',
    //   beta: 'RIB',
    //   riskPremium: 0,
    //   copShareCapitalType: 'user_input',
    //   costOfDebt: 'Use_Interest_Rate',
    //   capitalStructure: 'Capital Structure (Industry based)',
    // };
    // this.firstFormGroup.patchValue(obj);
    // this.secondFormGroup.patchValue(obj);
    // this.thirdFormGroup.patchValue(obj);
    this.thirdFormGroup.controls['riskFreeRate'].valueChanges.subscribe(      // Changed to riskFreeRate
      (val) => {                                                                  // Obselete code to be updated
        if (val == 'user_input_year') {
          const modalRef = this.modalService.open(UserInputComponent);
          modalRef.componentInstance.modalTitle =
            'Mentioned Any Year Based Indian Treasury Bond';
          modalRef.result.then((vals: any) => {
            this.riskRate = vals;
            this.thirdFormGroup.controls['riskFreeRateYear'].patchValue(vals)
          });
          
        } else {
          this.thirdFormGroup.controls['riskFreeRateYear'].patchValue(null)
          this.thirdFormGroup.controls['riskFreeRateType'].patchValue('10_year')
          // this.riskRate = null;
        }
      }
    );

    this.firstFormGroup.controls['model'].valueChanges.subscribe((val) => {
      if(!val) return;
      if (val == 'FCFE')
        this.thirdFormGroup.controls['discountRate'].setValue(
          'Cost of Equity'
        );
      if (val == 'FCFF') {
      this.thirdFormGroup.controls['discountRate'].setValue('WACC');
         this.terminalGrowthField.enable();
      }
      else this.terminalGrowthField.disable();

      if (val == 'Relative_Valuation') {
        this.clearValidatorForRelative();
        // const modalRef = this.modalService.open(RelativeComponent);
      } else {
        this.addValidatorsForRelative();
      }
    });


    // this.thirdFormGroup.controls['expMarketReturnType'].valueChanges.subscribe((val) => {
    //   const beta = parseFloat(this.betaIndustriesId.beta)
    //   if(!val) return;
    //   if (val == 'levered')
    //     this.thirdFormGroup.controls['beta'].setValue(
    //       beta
    //     );
    //   else if (val == 'unlevered') {
    //     const deRatio = parseFloat(this.betaIndustriesId.deRatio)/100
    //     const effectiveTaxRate = parseFloat(this.betaIndustriesId.effectiveTaxRate)/100;        
    //     const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
    //     this.thirdFormGroup.controls['beta'].setValue(
    //       unleveredBeta
    //     );
    //   }
    //   else {
    //     // Do nothing for now
    //   }
    //   this.thirdFormGroup.controls['expMarketReturn'].setValue(
    //     ''
    //   );
    // });


    this.thirdFormGroup.controls['betaType'].valueChanges.subscribe((val) => {
      const beta = parseFloat(this.betaIndustriesId.beta);
      if(!val) return;
      if (val == 'levered')
        this.thirdFormGroup.controls['beta'].setValue(
          beta
        );
      else if (val == 'unlevered') {
        const deRatio = parseFloat(this.betaIndustriesId.deRatio)/100
        const effectiveTaxRate = parseFloat(this.betaIndustriesId.effectiveTaxRate)/100;        
        const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
        this.thirdFormGroup.controls['beta'].setValue(
          unleveredBeta
        );
      }
      else {
        // Do nothing for now
      }
      
    });

    this.secondFormGroup.controls['type'].valueChanges.subscribe((val) => {
      if (val == 'automatic') {
        const modalRef = this.modalService.open(RelativeComponent);
      } else if (val == 'industry'){
         // Do something here 
      } else {
        // Populate as required
      }
    });

    this.thirdFormGroup.controls['capitalStructureType'].valueChanges.subscribe(
      (val) => {
        if(!val) return
        if (val == 'Industry_Based') {
          this.debtRatio = parseFloat(this.betaIndustriesId.deRatio)/100;
          this.totalCapital = 1 + this.debtRatio;
          this.debtProp = this.debtRatio/this.totalCapital;
          this.equityProp = 1 - this.debtProp;
          console.log(this.debtRatio + " " + this.equityProp);
          // });
        } else {
          // this.anaConEst = null;
        }
      }
    );

    this.thirdFormGroup.controls['expMarketReturnType'].valueChanges.subscribe(
      (val) => {
        if(!val) return
        if (val == 'ACE') {
          const modalRef = this.modalService.open(UserInputComponent);
          modalRef.componentInstance.modalTitle = 'Analyst Consensus Estimates';
          modalRef.result.then((val: any) => {
            this.thirdFormGroup.controls['expMarketReturn'].setValue(
                  val
                );
          });
        } else if(val == ''){
          this.thirdFormGroup.controls['expMarketReturn'].setValue(
                '10%'
              );    // Setting default value
        } else {
          this.thirdFormGroup.controls['expMarketReturn'].setValue(
                val
              );
        }
      }
    );
  }
  addValidatorsForRelative() {
    this.secondFormGroup.controls['taxRateType'].reset();
    this.secondFormGroup.controls['taxRateType'].enable();
    this.EnteredTaXRate = '';

    this.thirdFormGroup.controls['discountRate'].enable();
    this.secondFormGroup.controls['terminalGrowthRate'].enable();
    this.thirdFormGroup.controls['discountingPeriod'].enable();
    this.thirdFormGroup.controls['coeMethod'].enable();
    this.thirdFormGroup.controls['riskFreeRateType'].reset();
    this.thirdFormGroup.controls['riskFreeRateType'].enable();
    this.thirdFormGroup.controls['expMarketReturnType'].reset();
    this.thirdFormGroup.controls['expMarketReturnType'].enable();
    
    this.thirdFormGroup.controls['coeMethod'].enable();

    // this.thirdFormGroup.controls['beta'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['riskPremium'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['copShareCapitalType'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['costOfDebt'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['capitalStructure'].setValidators( Validators.required);
  }

  clearValidatorForRelative() {
    this.thirdFormGroup.controls['discountRate'].disable();
    this.secondFormGroup.controls['terminalGrowthRate'].disable();
    this.thirdFormGroup.controls['discountingPeriod'].disable();
    this.thirdFormGroup.controls['coeMethod'].disable();
    this.thirdFormGroup.controls['expMarketReturnType'].reset();
    this.thirdFormGroup.controls['expMarketReturnType'].disable();
    // this.secondFormGroup.controls['riskFreeRateType'].disable();
    this.secondFormGroup.controls['taxRateType'].reset()
    this.secondFormGroup.controls['taxRate'].reset();
    
    this.EnteredTaXRate = null;
    this.thirdFormGroup.controls['riskFreeRateType'].patchValue('');
    this.secondFormGroup.controls['taxRateType'].disable();
    this.thirdFormGroup.controls['riskFreeRateType'].disable();
     
    // this.thirdFormGroup.controls['beta'].clearValidators( );
    // this.thirdFormGroup.controls['riskPremium'].clearValidators();
    // this.thirdFormGroup.controls['copShareCapitalType'].clearValidators();
    // this.thirdFormGroup.controls['costOfDebt'].clearValidators();
    // this.thirdFormGroup.controls['capitalStructure'].clearValidators();
    // this.secondFormGroup.controls['company1'].setValidators(Validators.required)
    // this.secondFormGroup.controls['company2'].setValidators(Validators.required)
    // this.secondFormGroup.controls['company3'].setValidators(Validators.required)
  }

  get terminalGrowthField() {
    return this.secondFormGroup.controls['terminalGrowthRate'];
  }

  get isTerminalShow() {
    return this.firstFormGroup.controls['model']?.value != 'Relative_Valuation'
      ? true
      : false;
  }

  get isRelative() {
    return this.firstFormGroup.controls['model']?.value == 'Relative_Valuation'
      ? true
      : false;
  }

  get isCOE() {
    return this.firstFormGroup.controls['model']?.value == 'Relative_Valuation'
      ? true
      : false;
  }

  get isWACC() {
    return this.firstFormGroup.controls['model']?.value == 'Relative_Valuation'
      ? true
      : false;
  }

  inItData() {
    
    forkJoin([this._valuationService.getValuationDropdown(),this._dataReferencesService.getIndianTreasuryYields(),
    this._dataReferencesService.getHistoricalReturns(),
    this._dataReferencesService.getBetaIndustries(),
    // this._dataReferencesService.getBetaIndustriesById(),
    // this._dataReferencesService.getIndustriesRatio()
  ])
    // this._valuationService.getValuationDropdown()

    // Individual dropdown implemented will be added in subsequest array element
    .subscribe((resp: any) => {
      this.industries = resp[0][DROPDOWN.INDUSTRIES];
      this.valuationM = resp[0][DROPDOWN.MODAL];
      this.taxR = resp[0][DROPDOWN.TAX];
      this.discountR = resp[0][DROPDOWN.DISCOUNT];
      this.growthR = resp[0][DROPDOWN.GROWTH];
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
      // console.log(this.historicalReturns);
      this.betaIndustries = resp[DROPDOWN.BETAINDUSTRIES]; // Set as array element 3
      // this.industriesRatio = resp[DROPDOWN.INDUSTRIESRATIO]; //Set as array element 4

    });
    
  }

  clean(obj:any) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] == '') {
        delete obj[propName];
      }
    }
    return obj
  }

  returnDate(myDate: any) {
    return new Date(myDate.year, myDate.month, myDate.day);
  }

  submitForm(stepper: MatStepper) {
    let payload = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    };
    // if payload['']
    if (this.isRelative) {
      payload['companies'] = this.companies;
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
    if (this.thirdFormGroup.controls['capitalStructureType'].value == 'Industry_based') {
      payload['capitalStructure'] = capitalStructure;
    }
    const myDate = payload['valuationDate'];
    // console.log(myDate);

    this.newDate = new Date(myDate.year, myDate.month - 1, myDate.day);
    // console.log(newDate);
    payload['valuationDate'] = this.newDate.getTime();
    // console.log(payload['valuationDate']);
    this.valuationDataReport = [];
    // this.newValDate = newDate;
    console.log(payload);
    this._valuationService.submitForm(this.clean(payload)).subscribe(
      (res: any) => {
        this.reportId = res.reportId;
        if (this.isRelative == false) {
          const objs = Object.keys(res.valuationData[0]);
          for (let index = 0; index < objs.length; index++) {
            const data = res.valuationData.map((e: any) => e[objs[index]]);
            this.valuationDataReport.push(data);
          }
        } else {
          this.valuationDataReport = res.valuationData.valuation;
        }

        stepper.next();
        this.errorMsg = '';
      },
      (err: any) => {
        console.log(err);
        this.errorMsg = err.error.message.message;
      }
    );
  }

  get isDownloadAllow() {
    return this.firstFormGroup.controls['projectionYears'].value ? true : false;
  }

  get exportResult() {
    return environment.baseUrl + 'export/' + this.reportId;
  }

  get downloadTemplate() {
    return (
      environment.baseUrl +
      'download/template/' +
      (this.firstFormGroup.controls['projectionYears'].value || '1')
    );
  }

  onFileSelected(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    const file: File = this.files[0];

    if (file) {
      const formData = new FormData();

      formData.append('file', file);

      this._valuationService.fileUpload(formData).subscribe((res: any) => {
        this.secondFormGroup.patchValue(res);
      });
    }
  }

  get checkValidForm() {
    return (
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      (this.isRelative ? true : this.thirdFormGroup.valid)
    );
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  getIndustriesbyId(id: any) {
    this._valuationService.getIndustries(id).subscribe((resp: any) => {});
  }
  getbyCompaniesId(id: any) {
    this._valuationService.getCompanies(id).subscribe((resp: any) => {});
  }


  getIndustriesRatiobyId(id: any) {
    this._dataReferencesService.getIndustriesRatio(id).subscribe((resp: any) => {});
  }

  // getBetaIndustriesById(id: any) {
  //   this._dataReferencesService.getBetaIndustriesById(id).subscribe((resp: any) => {});
  // }
  
  findMedian(type: string) {
    const numbers = this.companies.map((c: any) => c[type]);
    numbers.sort((a, b) => a - b);
    const middleIndex = Math.floor(numbers.length / 2);
    const isEvenLength = numbers.length % 2 === 0;
    if (isEvenLength) {
      this.companyMedian[type] =
        (numbers[middleIndex - 1] + numbers[middleIndex]) / 2;
    } else {
      this.companyMedian[type] = numbers[middleIndex];
    }
  }

  findAverage(type: string) {
    const numbers = this.companies.map((c: any) => c[type]);
    const sum = numbers.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const average = sum / numbers.length;
    // return average;
    this.companyAverage[type] = average;
  }
  addCompany() {
    this.Companies.push(new FormControl(null));
  }

  get Companies() {
    return this.secondFormGroup.controls['companies'] as FormArray;
  }

  removeCmp(i: any) {
    this.Companies.controls.splice(i, 1);
  }
}

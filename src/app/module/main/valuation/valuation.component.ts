import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/enviroments/enviroments';
import { HEADING_OBJ } from 'src/app/shared/enums/constant';
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
  EnteredTaXRate: any = '';
  modalTitle: any = '';
  riskRate: any = '';
  reportId: any;
  valuationDataReport: any[] = [];
  tableHeading = Object.values(HEADING_OBJ);
  anaConEst: any = '';
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
  relativeFormGroup!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _valuationService: ValuationService,
    private modalService: NgbModal
  ) {
    this.generateForm();
  }
  ngOnInit(): void {
    this.inItData();
    console.log(this.tableHeading);
  }

  generateForm() {
    this.firstFormGroup = this._formBuilder.group({
      valuationDate: ['', Validators.required],
      company: ['', Validators.required],
      industry: ['', Validators.required],
      projectionYears: ['', Validators.required],
      model: ['', Validators.required],
      userId: ['641d654fa83ed4a5f0293a52', Validators.required],
      subIndustry: ['', Validators.required],
      discountRateType: ['WACC', Validators.required],
      discountRateValue: [10, Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      outstandingShares: ['', Validators.required],
      taxRateType: ['', Validators.required], 
      taxRate :[8],
      discountRate: ['', Validators.required],
      terminalGrowthRate: [''],
      discountingPeriod: ['', Validators.required],
      coeMethod: ['', Validators.required],
      riskFreeRateType: ['', Validators.required],
      riskFreeRateYear: [''],
      riskFreeRate: [2],
     
    


      expMarketReturnType: ['', Validators.required],
      expMarketReturn:[2],

      excelSheetId: ['', Validators.required],
      companies: this._formBuilder.array([]),
      type: ['manual', Validators.required],
    });
    this.addCompany();
    this.addCompany();
    this.addCompany();

    this.thirdFormGroup = this._formBuilder.group({
      beta: [2, Validators.required],
      betaType: ['', Validators.required],
      riskPremium: [2],
      copShareCapitalType: ['', Validators.required],
      copShareCapital:[1],
      costOfDebt: [2],
      costOfDebtType: ['', Validators.required],
      capitalStructureType: ['', Validators.required],
      popShareCapitalType:["", Validators.required],
    });

    this.relativeFormGroup = this._formBuilder.group({});
    this.fourthFormGroup = this._formBuilder.group({
      type: ['', Validators.required],
    });

    this.secondFormGroup.controls['taxRateType'].valueChanges.subscribe(
      (val) => {
        if (val) {
          this.modalTitle = val;
          console.log(val);
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
        return;
      }
      const indst = this.industries.find((e) => e.industry == val);
      this._valuationService.getIndustries(indst._id).subscribe((resp: any) => {
        console.log(resp);
        this.subIndustries = resp;
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
          console.log(resp);
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
    this.secondFormGroup.controls['riskFreeRateType'].valueChanges.subscribe(
      (val) => {
        if (val == 'user_input_year') {
          const modalRef = this.modalService.open(UserInputComponent);
          modalRef.componentInstance.modalTitle =
            'Mentioned Any Year Based Indian Treasury Bond';
          modalRef.result.then((vals: any) => {
            this.riskRate = vals;
            this.secondFormGroup.controls['riskFreeRateYear'].patchValue(vals)
          });
          
        } else {
          this.secondFormGroup.controls['riskFreeRateYear'].patchValue(null)
          this.riskRate = null;
        }
      }
    );

    this.firstFormGroup.controls['model'].valueChanges.subscribe((val) => {
      if(!val) return;
      if (val == 'FCFE')
        this.secondFormGroup.controls['discountRate'].setValue(
          'Cost of Equity'
        );
      if (val == 'FCFF')
         this.terminalGrowthField.enable();
      else this.terminalGrowthField.disable();

      if (val == 'Relative_Valuation') {
        this.clearValidatorForRelative();
        // const modalRef = this.modalService.open(RelativeComponent);
      } else {
        this.addValidotorsForRelative();
      }
    });

    this.secondFormGroup.controls['type'].valueChanges.subscribe((val) => {
      if (val == 'automatic') {
        const modalRef = this.modalService.open(RelativeComponent);
      }
    });

    this.secondFormGroup.controls['expMarketReturnType'].valueChanges.subscribe(
      (val) => {
        if(!val) return
        if (val == 'ACE') {
          const modalRef = this.modalService.open(UserInputComponent);
          modalRef.componentInstance.modalTitle = 'Analyst Consensus Estimates';
          modalRef.result.then((val: any) => {
            this.anaConEst = val;
          });
        } else {
          this.anaConEst = null;
        }
      }
    );
  }
  addValidotorsForRelative() {
    this.secondFormGroup.controls['taxRateType'].reset();
    this.secondFormGroup.controls['taxRateType'].enable();
    this.EnteredTaXRate = null;

    this.secondFormGroup.controls['discountRate'].enable();
    this.secondFormGroup.controls['terminalGrowthRate'].enable();
    this.secondFormGroup.controls['discountingPeriod'].enable();
    this.secondFormGroup.controls['coeMethod'].enable();
    this.secondFormGroup.controls['riskFreeRateType'].reset();
    this.secondFormGroup.controls['riskFreeRateType'].enable();
    this.secondFormGroup.controls['expMarketReturnType'].reset();
    this.secondFormGroup.controls['expMarketReturnType'].enable();
    
    this.secondFormGroup.controls['coeMethod'].enable();

    // this.thirdFormGroup.controls['beta'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['riskPremium'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['copShareCapitalType'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['costOfDebt'].setValidators( Validators.required);
    // this.thirdFormGroup.controls['capitalStructure'].setValidators( Validators.required);
  }

  clearValidatorForRelative() {
    this.secondFormGroup.controls['discountRate'].disable();
    this.secondFormGroup.controls['terminalGrowthRate'].disable();
    this.secondFormGroup.controls['discountingPeriod'].disable();
    this.secondFormGroup.controls['coeMethod'].disable();
    this.secondFormGroup.controls['expMarketReturnType'].reset();
    this.secondFormGroup.controls['expMarketReturnType'].disable();
    // this.secondFormGroup.controls['riskFreeRateType'].disable();
    this.secondFormGroup.controls['taxRateType'].reset()
    this.secondFormGroup.controls['taxRate'].reset();
    
    this.EnteredTaXRate = null;
    this.secondFormGroup.controls['riskFreeRateType'].patchValue('');
    this.secondFormGroup.controls['taxRateType'].disable();
    this.secondFormGroup.controls['riskFreeRateType'].disable();
     
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
    return this.firstFormGroup.controls['model']?.value == 'FCFF'
      ? false
      : true;
  }

  get isRelative() {
    return this.firstFormGroup.controls['model']?.value == 'Relative_Valuation'
      ? true
      : false;
  }

  inItData() {
    this._valuationService.getValuationDropdown().subscribe((resp: any) => {
      this.industries = resp[DROPDOWN.INDUSTRIES];
      this.valuationM = resp[DROPDOWN.MODAL];
      this.taxR = resp[DROPDOWN.TAX];
      this.discountR = resp[DROPDOWN.DISCOUNT];
      this.growthR = resp[DROPDOWN.GROWTH];
      this.equityM = resp[DROPDOWN.EQUITY];
      this.riskF = resp[DROPDOWN.RISK];
      this.marketE = resp[DROPDOWN.EMARKET];
      this.betaS = resp[DROPDOWN.BETA];
      this.rPremium = resp[DROPDOWN.PREMIUM];
      this.preShaCap = resp[DROPDOWN.PREFERANCE_SHARE_CAPITAL];
      this.debt = resp[DROPDOWN.DEBT];
      this.cStructure = resp[DROPDOWN.CAPTIAL_STRUCTURE];
      this.pppShareCaptial = resp[DROPDOWN.P_P_SHARE_CAPTIAL];
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
    if (this.isRelative) {
      payload['companies'] = this.companies;
    }
    const myDate = payload['valuationDate'];
    var newDate = new Date(myDate.year, myDate.month, myDate.day);
    payload['valuationDate'] = newDate.getTime();
    this.valuationDataReport = [];
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
    return environment.HOST + 'export/' + this.reportId;
  }

  get downloadTemplate() {
    return (
      environment.HOST +
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

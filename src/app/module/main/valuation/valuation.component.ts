import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
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

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  item: any;
  isEditable = true;
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
      projectionYear: ['', Validators.required],
      model: ['', Validators.required],
      userId: ['641d654fa83ed4a5f0293a52', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      outstandingShares: ['', Validators.required],
      taxRateType: ['', Validators.required],
      discountRate: ['', Validators.required],
      terminalGrowthRate: ['', Validators.required],
      discountingPeriod: ['', Validators.required],
      coeMethod: ['', Validators.required],
      riskFreeRateType: ['', Validators.required],
      expMarketReturnType: ['', Validators.required],
      excelSheetId: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      beta: ['', Validators.required],
      riskPremium: ['', Validators.required],
      copShareCapitalType: ['', Validators.required],
      costOfDebt: ['', Validators.required],
      capitalStructure: ['', Validators.required],
    });
    this.fourthFormGroup = this._formBuilder.group({
      type: ['', Validators.required],
    });

    this.secondFormGroup.controls['taxRateType'].valueChanges.subscribe(
      (val) => {
        this.modalTitle = val;
        console.log(val);
        const modalRef = this.modalService.open(UserInputComponent);
        modalRef.componentInstance.modalTitle = val;
        modalRef.result.then((val: any) => {
          this.EnteredTaXRate = val;
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
          modalRef.result.then((val: any) => {
            this.riskRate = val;
          });
        } else {
          this.riskRate = null;
        }
      }
    );

    this.firstFormGroup.controls['model'].valueChanges.subscribe((val) => {
      if (val == "FCFE")
        this.secondFormGroup.controls['discountRate'].setValue('Cost of Equity')
      if (val == "FCFF")
        this.terminalGrowthField.setValidators(Validators.required)
      else
        this.terminalGrowthField.clearValidators()
    })

    this.secondFormGroup.controls['expMarketReturnType'].valueChanges.subscribe(
      (val) => {
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

  get terminalGrowthField(){
    return this.secondFormGroup.controls['terminalGrowthRate']
  }



  get isTerminalShow() {
    return this.firstFormGroup.controls['model'].value == 'FCFF' ? false : true
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

  submitForm(stepper: MatStepper) {
    let payload = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    };
    const myDate = payload['valuationDate'];
    var newDate = new Date(myDate.year, myDate.month, myDate.day);
    payload['valuationDate'] = newDate.getTime();
    this.valuationDataReport = []
    this._valuationService.submitForm(payload).subscribe(
      (res: any) => {
        this.reportId = res.reportId;
        const objs = Object.keys(res.valuationData[0])
        for (let index = 0; index < objs.length; index++) {
          const data = res.valuationData.map((e: any) => e[objs[index]])
          this.valuationDataReport.push(data)

        }


        stepper.next();
        this.errorMsg = '';
      },
      (err: any) => {
        console.log(err);
        this.errorMsg = err.error.message;
      },
    );
  }

  get isDownloadAllow() {
    return this.firstFormGroup.controls['projectionYear'].value ? true : false;
  }


  get exportResult() {
    return environment.HOST + 'export/' + this.reportId;
  }

  get downloadTemplate() {
    return environment.HOST + 'download/template/' + (this.firstFormGroup.controls['projectionYear'].value || '1');
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

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
      this.thirdFormGroup.valid
    );
  }
}

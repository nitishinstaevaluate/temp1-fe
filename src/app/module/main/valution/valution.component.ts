import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin, map } from 'rxjs';
import { ValutionService } from 'src/app/shared/service/valution.service';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-valution',
  templateUrl: './valution.component.html',
  styleUrls: ['./valution.component.scss'],
})
export class ValutionComponent implements OnInit {
  @ViewChild('textratemodal') textratemodal?: TemplateRef<any>;
  @ViewChild('rFRatemodal') rFRatemodal?: TemplateRef<any>;

  industries: any[] = [];
  valutionM: any[] = [];
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

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  stepperOrientation: any;
  item: any;

  firstFormGroups = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroups = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private _valutionService: ValutionService,
    private modalService: NgbModal
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.generateForm();
  }
  ngOnInit(): void {
    this.inItData();
  }

  generateForm() {
    this.firstFormGroup = this._formBuilder.group({
      valutionDate: ['', Validators.required],
      company: ['', Validators.required],
      industry: ['', Validators.required],
      projectionYear: ['', Validators.required],
      model: ['', Validators.required],
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
    });

    this.thirdFormGroup = this._formBuilder.group({
      beta: ['', Validators.required],
      riskPremium: ['', Validators.required],
      copShareCapitalType: ['', Validators.required],
      costOfDebt: ['', Validators.required],
      capitalStructure: ['', Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
    this.secondFormGroup.controls['taxRateType'].valueChanges.subscribe(
      (val) => {
        this.modalTitle = val;
        console.log(val);
        if (val == 'Normal Tax Rate') {
        } else {
        }
        this.openModel(this.textratemodal);
      }
    );
    this.secondFormGroup.controls['riskFreeRateType'].valueChanges.subscribe(
      (val) => {
        if (val == 'Mention Any Year based Indian Treasury Bond') {
          this.openModel(this.rFRatemodal);
        } else {
          this.riskRate = null;
        }
      }
    );
  }
  inItData() {
    this._valutionService.getValutionDropdown().subscribe((resp: any) => {
      this.industries = resp[DROPDOWN.INDUSTRIES];
      this.valutionM = resp[DROPDOWN.MODAL];
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
  openModel(modal?: TemplateRef<any>) {
    this.modalService
      .open(modal, { size: 'sm', centered: true })
      .result.then((result: any) => {
        if (result) {
          this.riskRate = result;
        }
      });
  }

  submitForm() {
    // let payload = {
    //   ...this.firstFormGroup.value,
    //   ...this.secondFormGroup.value,
    //   ...this.thirdFormGroup.value,
    // };
    let payload = {
      userId: '641d654fa83ed4a5f0293a52',
      excelSheetId: '1680591417855-FCFE Input Sheet with Formula (1).xlsx',
      valuationDate: '',
      company: 'ABCD',
      industry: 'ABC',
      projectionYears: '6',
      model: 'FCFF',
      outstandingShares: 1000,
      taxRateType: 'Normal_Tax_Rate',
      taxRate: 8,
      discountRate: 'WACC',
      terminalGrowthRate: 4.5,
      discountingPeriod: 'Full_Period',
      coeMethod: 'CAPM',
      riskFreeRateType: 'user_input_year',
      riskFreeRateYear: 3.5,
      riskFreeRate: 6,
      expMarketReturnType: 'ACE',
      expMarketReturn: 6,
      historicalYears: '5',
      betaType: '',
      beta: 5,
      riskPremium: 4,
      copShareCapitalType: 'user_input',
      copShareCapital: 1,
      costOfDebtType: 'Finance_Cost',
      costOfDebt: 10,
      capitalStructure: 'Company_Based',
      popShareCapitalType: 'CFBS',
    };
    this._valutionService.submitForm(payload).subscribe((res) => {});
  }
}

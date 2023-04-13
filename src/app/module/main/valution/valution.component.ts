import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-valution',
  templateUrl: './valution.component.html',
  styleUrls: ['./valution.component.scss'],
})
export class ValutionComponent implements OnInit {
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
    private _formBuilder :FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private _valutionService: ValutionService
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
      valutionDate: [''],
      company: [''],
      industry: [''],
      projectionYear: [''],
      model: [''],
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
}

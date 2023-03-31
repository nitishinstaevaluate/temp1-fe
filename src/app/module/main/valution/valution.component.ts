import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin, map } from 'rxjs';
import { ValutionService } from 'src/app/shared/service/valution.service';
import {DROPDOWN } from 'src/app/shared/enums/enum';

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
  growthR: any[] =[];
  equityM: any[]= [];
  riskF: any[]=[];
  marketE: any[]=[];

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  stepperOrientation: any;
  item: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private _valutionService: ValutionService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  ngOnInit(): void {
    this.generateForm();
    this.inItData();
  }

  generateForm() {
    this.firstFormGroup = this.fb.group({
      valutionDate: ['', Validators.required],
      company: ['', Validators.required],
      industry: ['', Validators.required],
      projectionYear: ['', Validators.required],
      model: ['', Validators.required],
    });

    this.secondFormGroup = this.fb.group({
      outstandingShares: ['', Validators.required],
      model: ['', Validators.required],
      taxRate: ['', Validators.required],
      discountRate: ['', Validators.required],
      terminalGrowthRate: ['', Validators.required],
      discountingPeriod: ['', Validators.required],
      coeMethod: ['', Validators.required],
      riskFreeRate: ['', Validators.required],
      expMarketReturn: ['', Validators.required],
    });

    this.thirdFormGroup = this.fb.group({
      birthdate: ['', Validators.required],
      age: [''],
      hasPassport: ['', Validators.required],
    });

    this.fourthFormGroup = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
  }
  inItData() {
      this._valutionService.getValutionDropdown().subscribe((resp:any)=>{
      this.industries = resp[DROPDOWN.INDUSTRIES];
      this.valutionM = resp[DROPDOWN.MODAL]
      this.taxR = resp[DROPDOWN.TAX]
      this.discountR = resp[DROPDOWN.DISCOUNT]
      this.growthR = resp[DROPDOWN.GROWTH]
      this.equityM = resp[DROPDOWN.EQUITY]
      this.riskF =  resp[DROPDOWN.RISK]
      this.marketE = resp[DROPDOWN.EMARKET]
    })
  }
}

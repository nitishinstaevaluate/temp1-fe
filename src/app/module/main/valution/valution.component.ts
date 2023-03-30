import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Component({
  selector: 'app-valution',
  templateUrl: './valution.component.html',
  styleUrls: ['./valution.component.scss'],
})
export class ValutionComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  stepperOrientation: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      valutionDate : ['', Validators.required],
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
}

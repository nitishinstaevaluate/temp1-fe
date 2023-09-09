import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-main-valuation',
  templateUrl: './main-valuation.component.html',
  styleUrls: ['./main-valuation.component.scss']
})

export class MainValuationComponent {
  headerLabel='Valuation of Company';
  initiateForm:any=true;
  currentStepIndex:any=0;    
  transferSteppertwo:any;    
  transferStepperthree:any;    
  constructor(private _formBuilder : FormBuilder){
  }
  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  onStepChange(event: any,stepper:any) {
    this.currentStepIndex = this.stepper.selectedIndex;
    if(event.selectedIndex +1 == 1) return this.headerLabel = 'Valuation of Company';
    if(event.selectedIndex +1 == 2) return this.headerLabel = 'Review Form';
    if(event.selectedIndex +1 == 3) return this.headerLabel = 'Evaluate Result';
    return 'Valuation of Company';
    
  }

  handleSaveAndNext() {
    this.stepper.next();
  }
  groupModelControls(data:any){
    this.transferSteppertwo = data;
    this.stepper.next();
  }
  previous(event:any){
    this.stepper.previous();
  }
  groupReviewControls(data:any){
    this.transferStepperthree= {formOneData:this.transferSteppertwo,formTwoData:data};
    this.stepper.next();
  }
}

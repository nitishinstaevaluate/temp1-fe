import { Component, ViewChild, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-main-valuation',
  templateUrl: './main-valuation.component.html',
  styleUrls: ['./main-valuation.component.scss']
})

export class MainValuationComponent{
  headerLabel='Valuation of Company';
  initiateForm:any=true;
  currentStepIndex:any=0;    
  transferSteppertwo:any;    
  transferStepperthree:any;    
  formOneData: any;

  fcfeData:any
  fcffData:any
  relativeData:any

  next=0;
  
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
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });

  onStepChange(event: any,stepper:any) {
    this.currentStepIndex = this.stepper.selectedIndex;
    if(event.selectedIndex +1 == 1) return this.headerLabel = 'Valuation of Company';
    if(event.selectedIndex +1 == 3) return this.headerLabel = 'Review Form';
    if(event.selectedIndex +1 == 4) return this.headerLabel = 'Evaluate Result';
    return 'Valuation of Company';
  }

  handleSaveAndNext() {
    this.stepper.next();
  }
  groupModelControls(data:any){
    this.transferSteppertwo = data;
    this.formOneData = data;
    this.stepper.next();
    this.nextModelSelection();
  }
  previous(event:any){
    this.stepper.previous();
  }
  groupReviewControls(data:any){
    this.transferStepperthree= {formOneData:this.transferSteppertwo,formTwoData:data};
    this.stepper.next();
  }
  fcfeDetails(data:any){
    this.fcfeData=data;
    this.nextModelSelection(data.status);

  }

  fcffDetails(data:any){
    this.fcffData=data;
    this.nextModelSelection(data.status);
  }

  relativeValDetails(data:any){
    this.relativeData=data;
    this.nextModelSelection(data.status);

  }

  nextModelSelection(data?:any){
    const model = this.formOneData.model;

    const currentModel =this.formOneData?.model[model.indexOf(data)+1];
 
      switch (currentModel) {
        case 'FCFE':
          this.next = 1;
          break;
        case 'FCFF':
          this.next = 2;
          break;
        case 'Relative_Valuation':
          this.next = 3;
          break;
        default:
          console.log("went in default");
          this.stepper.next(); 
      
    }
  }
  
  previousModelSelection(modelName?:string){
     // Determine the 'next' property based on the current model
     const currentModel = this.formOneData?.model[this.formOneData?.model.indexOf(modelName)-1];
     console.log(currentModel,"current model")
     console.log(this.formOneData.model,"models array")
  
     switch (currentModel) {
       case 'FCFE':
         this.next = 1;
         break;
       case 'FCFF':
         this.next = 2;
         break;
       case 'Relative_Valuation':
         this.next = 3;
         break;
       default:
        this.stepper.previous(); 
     }
  }
  fcfeDetailsPrev(data:any){
    console.log("fcfe data",data)
    this.previousModelSelection(data?.status)
  }
  fcffDetailsPrev(data:any){
    console.log(data,"status")
    this.previousModelSelection(data?.status)
  }

  relativeValDetailsPrev(data:any){
    this.previousModelSelection(data?.status);
  }

  formOneAndTwoData(){
    return {
      ...this.transferSteppertwo,
      ...this.fcffData,
      ...this.fcfeData,
      ...this.relativeData
    }
  }
}

import { Component, ViewChild, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { IS_ARRAY_EMPTY_OR_NULL, isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';

@Component({
  selector: 'app-main-valuation',
  templateUrl: './main-valuation.component.html',
  styleUrls: ['./main-valuation.component.scss']
})

export class MainValuationComponent implements OnInit{
  headerLabel='';
  initiateForm:any=true;
  currentStepIndex:any=0;    
  transferSteppertwo:any;
  transferStepperthree:any;    
  transferStepperFour:any;    
  formOneData: any;
  fcfeData:any;
  fcffData:any;
  relativeData:any;
  excessEarnData:any;
  formOneAndTwoData:any;
  comparableIndustriesData:any;
  navData:any;
  modelArray:any=[];
  
  // breadcrumb property
  fcfePrev=false;
  fcffPrev=false;
  relativePrev=false;
  excessPrev=false;
  navPrev=false;

  step:any=0;  
  next=0;
  
  constructor(private _formBuilder : FormBuilder,private router:Router,private calculationService:CalculationsService){    }
  ngOnInit(): void {
    this.calculationService.steps.subscribe((response:number)=>{
      this.step=response
    })
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
  fifthFormGroup = this._formBuilder.group({
    fifthCtrl: ['', Validators.required],
  });

  
  onStepChange() {  
      this.formOneAndTwoData = {
        ...this.formOneData,
        ...(this.formOneData?.model.includes('FCFF') ? this.fcffData : {}),
        ...(this.formOneData?.model.includes('FCFE') ? this.fcfeData : {}),
        ...(this.formOneData?.model.includes('Relative_Valuation') ? this.relativeData : {}),
        ...(this.formOneData?.model.includes('Excess_Earnings') ? this.excessEarnData : {}),
        ...(this.formOneData?.model.includes('CTM') ? this.comparableIndustriesData : {}),
        ...(this.formOneData?.model.includes('NAV') ? this.navData : {}),
      };
    if(this.step == 1) return this.headerLabel = '';
    if(this.step == 2) return this.headerLabel = 'Model Inputs';
    if(this.step == 3) return this.headerLabel = 'Review Form';
    if(this.step == 4) return this.headerLabel = 'Evaluate Result';
    if(this.step == 5) return this.headerLabel = '';
    return '';
  }

  groupModelControls(data:any){
    this.transferSteppertwo = data;
    this.formOneData = data;
    this.modelArray=this.formOneData?.model;
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step')

  this.step = parseInt(currentStep) + 1;

  localStorage.setItem('step',`${this.step}`);
  this.calculationService.checkStepStatus.next({status:true,step:this.step})
  this.nextModelSelection();
  }

  previous(event:any){
    // this.stepper.previous();
    const currentStep:any = localStorage.getItem('step')
    this.step = parseInt(currentStep) - 1;
    localStorage.setItem('step',`${this.step}`)
    this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step,prev:true})
  }

  groupReviewControls(data:any){
    this.transferStepperthree= {formOneAndTwoData:this.formOneAndTwoData,formThreeData:data};
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step')
    this.step=parseInt(currentStep)
    this.calculationService.checkStepStatus.next({status:true,step:this.step})
  }

  resultData(data:any){
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step');
    this.step = parseInt(currentStep) + 1;
    localStorage.setItem('step',`${this.step}`)
    this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
    this.transferStepperFour = data; 
  }

  fcfeDetails(data:any){
    this.fcfeData=data;
    // console.log(data,"fcfe data")
    this.nextModelSelection(data.status);
    this.onStepChange();
  }

  fcffDetails(data:any){
    this.fcffData=data;
    this.nextModelSelection(data.status);
  }

  relativeValDetails(data:any){
    this.relativeData=data;
    this.nextModelSelection(data.status);
  }
  excessEarnDetails(data:any){
    this.excessEarnData=data;
    this.nextModelSelection(data.status);
  }
  comparableIndustriesDetails(data:any){
    this.comparableIndustriesData=data;
    this.nextModelSelection(data.status);
  }
  navDetails(data:any){
    this.navData=data;
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
        case 'Excess_Earnings':
          this.next = 4;
          break;
        case 'CTM':
          this.next = 5;
          break;
        case 'NAV':
          this.next = 6;
          break;
        default:
          // this.stepper.next(); 
          const currentStep:any = localStorage.getItem('step')
          this.step = parseInt(currentStep) + 1;
          localStorage.setItem('step',`${this.step}`)
          this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step})
      
    }
  }
  
  previousModelSelection(modelName?:string){
     // Determine the 'next' property based on the current model
     const currentModel = this.formOneData?.model[this.formOneData?.model.indexOf(modelName)-1];
  
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
       case 'Excess_Earnings':
         this.next = 4;
         break;
       case 'CTM':
         this.next = 5;
         break;
       case 'NAV':
         this.next = 6;
         break;
       default:
        // this.stepper.previous(); 
        const currentStep:any = localStorage.getItem('step')
        this.step = parseInt(currentStep) - 1;
        localStorage.setItem('step',`${this.step}`)
        this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step,prev:true})

     }
  }
  fcfeDetailsPrev(data:any){
    this.previousModelSelection(data?.status)
  }
  fcffDetailsPrev(data:any){
    this.previousModelSelection(data?.status)
  }

  relativeValDetailsPrev(data:any){
    this.previousModelSelection(data?.status);
  }
  excessEarnDetailsPrev(data:any){
    this.previousModelSelection(data?.status);
  }
  comparableIndustriesDetailsPrev(data:any){
    this.previousModelSelection(data?.status);
  }
  navDetailsPrev(data:any){
    this.previousModelSelection(data?.status);
  }

  // isModelValid(name:string, modelArray:any){
  //   return isSelected(name,modelArray)
  // }

  updateSelectedItems(item: string) {
    const index = this.modelArray.indexOf(item);
    if (index === -1) {
      this.modelArray.push(item);
    } else {
      this.modelArray.splice(index, 1);
    }
  }


  loadBreadcrumb(item: string) {
    switch (item) {
      case 'FCFE':
        this.next = 1;
        break;
      case 'FCFF':
        this.next = 2;
        break;
      case 'Relative_Valuation':
        this.next = 3;
        break;
      case 'Excess Earning':
        this.next = 4;
        break;
      default:
        // Handle other cases or invalid items
    }

    // while (this.modelArray.length > 0 && this.modelArray[this.modelArray.length - 1] !== item) {
    //   this.modelArray.pop();
    //   this.removeLastBreadcrumb();
    // }
    // this.addBreadcrumb(item);
    // this.modelArray.push(item);
  }

  // onBreadcrumbClicked(item: string) {
  //   // Remove all breadcrumbs after the clicked one
    
  // }

  addBreadcrumb(item: string) {
    this.modelArray.push(item);
  }

  removeLastBreadcrumb() {
    this.modelArray.pop();
  }

  getBreadcrumbHistory() {
    return this.modelArray;
  }


  checkArrayForBreadcrumb(){
    const element = this.modelArray[0];
    this.loadBreadcrumb(element);
  }

  createBreadcrumb(modelName:string){
    console.log(this.modelArray)
    const valueRmv=this.modelArray[this.modelArray.indexOf(modelName) + 1 ]
    const indexSplice=this.modelArray.indexOf(modelName) + 1 
    
    switch (modelName) {
      case 'FCFE':
        this.removeBreadcrumb(valueRmv);
        this.next = 1;
        return true;
        break;
      case 'FCFF':
        this.removeBreadcrumb(valueRmv);
        this.next = 2;
        return true;
        break;
      case 'Relative_Valuation':
        this.removeBreadcrumb(valueRmv);
        this.next = 3;
        return true;
        break;
        case 'Excess_Earnings':
          this.removeBreadcrumb(valueRmv);
          this.next = 4;
          return true;
        break;
      default:
        // Handle other cases or invalid items
    }
    if (indexSplice !== -1) {
      this.modelArray.splice(indexSplice, 1);
      // this.modelArray.push(indexSplice);
    } 
    return false;
  }

  removeBreadcrumb(modelName:string){
    switch (modelName) {
      case 'FCFE':
       this.fcfePrev=true;
        break;
      case 'FCFF':
       this.fcffPrev=true;
        break;
      case 'Relative_Valuation':
       this.relativePrev=true;
        break;
      case 'Excess_Earnings':
       this.excessPrev=true;
        break;
      default:
        // Handle other cases or invalid items
    }
  }
}

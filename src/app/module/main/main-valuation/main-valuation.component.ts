import { Component, ViewChild, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { IS_ARRAY_EMPTY_OR_NULL, isSelected } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-main-valuation',
  templateUrl: './main-valuation.component.html',
  styleUrls: ['./main-valuation.component.scss']
})

export class MainValuationComponent{
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
  fifthFormGroup = this._formBuilder.group({
    fifthCtrl: ['', Validators.required],
  });

  onStepChange(event: any,stepper:any) {
    this.currentStepIndex = this.stepper.selectedIndex;
    if(this.stepper.selectedIndex === 1){
      this.formOneAndTwoData = {
        ...this.formOneData,
        ...(this.formOneData?.model.includes('FCFF') ? this.fcffData : {}),
        ...(this.formOneData?.model.includes('FCFE') ? this.fcfeData : {}),
        ...(this.formOneData?.model.includes('Relative_Valuation') ? this.relativeData : {}),
        ...(this.formOneData?.model.includes('Excess_Earnings') ? this.excessEarnData : {}),
        ...(this.formOneData?.model.includes('CTM') ? this.comparableIndustriesData : {}),
        ...(this.formOneData?.model.includes('NAV') ? this.navData : {}),
      };
    }
    if(event.selectedIndex +1 == 1) return this.headerLabel = '';
    if(event.selectedIndex +1 == 2) return this.headerLabel = 'Model Inputs';
    if(event.selectedIndex +1 == 3) return this.headerLabel = 'Review Form';
    if(event.selectedIndex +1 == 4) return this.headerLabel = 'Evaluate Result';
    if(event.selectedIndex +1 == 5) return this.headerLabel = '';
    return '';
  }

  groupModelControls(data:any){
    this.transferSteppertwo = data;
    this.formOneData = data;
    this.modelArray=this.formOneData?.model;
    this.stepper.next();
    this.nextModelSelection();
  }
  previous(event:any){
    this.stepper.previous();
  }
  groupReviewControls(data:any){
    const {payload,...rest} = data;
    this.formOneAndTwoData.modifiedExcelSheetId = payload.modifiedExcelSheetId;
    this.formOneAndTwoData.isExcelModified = payload.isExcelModified;
    this.transferStepperthree= {formOneAndTwoData:this.formOneAndTwoData,formThreeData:rest};
    this.stepper.next();
  }
  previousGroupReviewControls(data:any){
    this.formOneData.modifiedExcelSheetId = data.modifiedExcelSheetId;
    this.formOneData.isExcelModified = data.isExcelModified
  }

  resultData(data:any){
    this.stepper.next();
    this.transferStepperFour = data; 
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
          this.stepper.next(); 
      
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
        this.stepper.previous(); 
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
    console.log(valueRmv,"to be removed")
    
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

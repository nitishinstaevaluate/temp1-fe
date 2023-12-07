import { Component, ViewChild, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MODELS } from 'src/app/shared/enums/constant';
import { isSelected } from 'src/app/shared/enums/functions';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';

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
  formTwoData:any;
  formThreeData:any;
  formFourData:any;
  formFiveData:any;
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
  isProcessExistLoader = true;
  
  constructor(private _formBuilder : FormBuilder,
    private calculationService:CalculationsService,
    private processStatusManagerService: ProcessStatusManagerService,
    private dialog :MatDialog,
    private snackBar: MatSnackBar,
    private ngxLoaderService:NgxUiLoaderService,
    ){    }
  ngOnInit(): void {
    this.calculationService.steps.subscribe((response:number)=>{
      if(response  === 0){
        this.step = 1
        localStorage.setItem('step',`${this.step}`)
      }else{
        this.step=response
      }
    })
  
    const processStateId = localStorage.getItem('processStateId');
    const processExec = localStorage.getItem('execProcess');
    if(processStateId && processExec === 'true'){
      this.loadStateByProcessId(processStateId)
    }
    else if(processStateId && processExec === 'false'){
      const data={
        value: 'restoreSession',
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%',disableClose:true});
      dialogRef.afterClosed().subscribe((result)=>{
        if (result.sessionRestoreFlag) {
          this.loadStateByProcessId(processStateId);
        } else {
          localStorage.removeItem('processStateId')
          this.isProcessExistLoader = false;
          this.ngxLoaderService.stop();
        }
      })
     
    }
    else{
      this.isProcessExistLoader = false;
      this.ngxLoaderService.stop();
    }

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
    // return '';
  }

  groupModelControls(data:any,incrementStep?:boolean){
    this.transferSteppertwo = data;
    this.formOneData = data;
    this.modelArray=this.formOneData?.model;
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step')
    if(incrementStep){
      this.step = parseInt(currentStep);
    }
    else{
      this.step = parseInt(currentStep) + 1;
    }

  localStorage.setItem('step',`${this.step}`);
  this.calculationService.checkStepStatus.next({status:true,step:this.step})
  this.nextModelSelection();
  }

  previous(event:any){
    // this.stepper.previous();
    const currentStep:any = localStorage.getItem('step')
    this.step = parseInt(currentStep) - 1;
    localStorage.setItem('step',`${this.step}`);
    this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step,prev:true})
    if(this.step === 2){
      this.previousModelSelection(this.formOneData,true)
    }
  }

  groupReviewControls(data:any){
    this.transferStepperthree= {formOneAndTwoData:this.formOneAndTwoData ? this.formOneAndTwoData :  this.formFourData?.formOneAndTwoData,formThreeData:data};
    console.log(this.transferStepperthree,"from review component details",this.formFourData,"form one and two data")
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
    this.onStepChange();
  }

  relativeValDetails(data:any){
    this.relativeData=data;
    this.nextModelSelection(data.status);
    this.onStepChange();
  }
  excessEarnDetails(data:any){
    this.excessEarnData=data;
    this.nextModelSelection(data.status);
    this.onStepChange();
  }
  comparableIndustriesDetails(data:any){
    this.comparableIndustriesData=data;
    this.nextModelSelection(data.status);
    this.onStepChange();
  }
  navDetails(data:any){
    this.navData=data;
    this.nextModelSelection(data.status);
    this.onStepChange();
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
  
  previousModelSelection(modelName?:string,isProcessState?:boolean){
    let currentModel;
    // Determine the 'next' property based on the current model
    currentModel = this.formOneData?.model[this.formOneData?.model.indexOf(modelName)-1];

    if(isProcessState){
      currentModel = this.formOneData?.model[this.formOneData.model.length-1]
    }
  
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

  ifModelExist(name:string, modelArray:any){
    if(modelArray)
      return isSelected(name,modelArray);
    return false;
  }

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

  loadStateByProcessId(processStateId:string){
    this.ngxLoaderService.start();
    this.processStatusManagerService.retrieveProcess(processStateId).subscribe((processInfo:any)=>{
      if(processInfo.status){
        const processStateDetails = processInfo.stateInfo;
        this.step = localStorage.setItem('step',`${processStateDetails.step}`)
        if(processStateDetails?.firstStageInput){
          localStorage.setItem('stepOneStats',`${processStateDetails.firstStageInput.formFillingStatus}`)
          this.groupModelControls(processStateDetails.firstStageInput,true)
        }

        if(processStateDetails?.secondStageInput){
          this.formTwoData = processStateDetails.secondStageInput;
        }

        if(processStateDetails?.secondStageInput && processStateDetails?.firstStageInput){
          this.formThreeData = {formOneData:processStateDetails.firstStageInput,formTwoData: this.formTwoData,formThreeData:processStateDetails?.thirdStageInput};
        }

        if(processStateDetails?.thirdStageInput || processStateDetails?.secondStageInput){
          let updatedPayload:any;
          this.formTwoData.map((formTwoDetails:any)=>{
            if(formTwoDetails.model === MODELS.FCFE && processStateDetails?.firstStageInput.model.includes(MODELS.FCFE)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
            if(formTwoDetails.model === MODELS.FCFF && processStateDetails?.firstStageInput.model.includes(MODELS.FCFF)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
            if(formTwoDetails.model === MODELS.EXCESS_EARNINGS && processStateDetails?.firstStageInput.model.includes(MODELS.EXCESS_EARNINGS)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
            if(formTwoDetails.model === MODELS.RELATIVE_VALUATION && processStateDetails?.firstStageInput.model.includes(MODELS.RELATIVE_VALUATION)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
            if(formTwoDetails.model === MODELS.COMPARABLE_INDUSTRIES && processStateDetails?.firstStageInput.model.includes(MODELS.COMPARABLE_INDUSTRIES)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
            if(formTwoDetails.model === MODELS.NAV && processStateDetails?.firstStageInput.model.includes(MODELS.NAV)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
          }) 
          this.formFourData = {formOneAndTwoData : updatedPayload,formThreeData:processStateDetails.thirdStageInput};
        }
        if(processStateDetails?.fourthStageInput){
          this.formFiveData = {...this.formFourData,formFourData : processStateDetails.fourthStageInput?.totalModelWeightageValue,formFiveData:processStateDetails?.fifthStageInput}
        }

        this.isProcessExistLoader = false;
        this.ngxLoaderService.stop();
        localStorage.setItem('execProcess','false')

        this.snackBar.open('Session Restored Successfully','OK',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      }
    })
  }
}

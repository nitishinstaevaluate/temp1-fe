import { Component, ViewChild, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
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
  formSixData:any;
  fcfeData:any;
  fcffData:any;
  relativeData:any;
  excessEarnData:any;
  formOneAndThreeData:any;
  comparableIndustriesData:any;
  navData:any;
  ruleElevenData:any;
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
  processLoader=false;
  
  constructor(private _formBuilder : FormBuilder,
    private calculationService:CalculationsService,
    private processStatusManagerService: ProcessStatusManagerService,
    private dialog :MatDialog,
    private snackBar: MatSnackBar,
    private route:Router
    ){    }
  ngOnInit() {
    if(!sessionStorage.getItem('access_token')){
      this.snackBar.open('Unauthorised Signatory','Sign-in',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
      setTimeout(() => {
        this.route.navigate(['./'])
      }, 3000);
      return;
    }
      
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
    if(processStateId && (processExec === 'false' || processExec === null)){
      const data={
        value: 'restoreSession',
      }
      const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'30%',disableClose:true});
      dialogRef.afterClosed().subscribe((result)=>{
        if (result.sessionRestoreFlag) {
          this.loadStateByProcessId(processStateId);
        } else {
          localStorage.removeItem('processStateId')
          this.isProcessExistLoader = true;
          this.processLoader = true
          window.location.reload();
        }
      })
     
    }
    else if(processStateId && processExec === 'true'){
      this.loadStateByProcessId(processStateId)
    }
    else{
      this.isProcessExistLoader = false;
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
      this.formOneAndThreeData = {
        ...this.formOneData,
        ...this.formTwoData,
        ...(this.formOneData?.model.includes('FCFF') ? this.fcffData : {}),
        ...(this.formOneData?.model.includes('FCFE') ? this.fcfeData : {}),
        ...(this.formOneData?.model.includes('Relative_Valuation') ? this.relativeData : {}),
        ...(this.formOneData?.model.includes('Excess_Earnings') ? this.excessEarnData : {}),
        ...(this.formOneData?.model.includes('CTM') ? this.comparableIndustriesData : {}),
        ...(this.formOneData?.model.includes('NAV') ? this.navData : {}),
        ...(this.formOneData?.model.includes('ruleElevenUa') ? this.ruleElevenData : {}),
      };
  }

  async groupModelControls(data:any,incrementStep?:boolean){
    this.transferSteppertwo = data;
    this.formOneData = data;
    this.modelArray=this.formOneData?.model;
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step')
    //  const currentStep:any = await  this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
    if(incrementStep){
      this.step = parseInt(currentStep);
    }
    else{
      this.step = parseInt(currentStep) + 1;
    }

  localStorage.setItem('step',`${this.step}`);
    // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),this.step);
    this.calculationService.checkStepStatus.next({status:true,step:this.step})
  this.nextModelSelection();
  }

  async previous(event:any){
    // this.stepper.previous();
    const currentStep:any = localStorage.getItem('step')
    // const currentStep:any = await this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
    this.step = parseInt(currentStep) - 1;
    localStorage.setItem('step',`${this.step}`);
    // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),this.step);
    this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step,prev:true})
    if(this.step === 3){
      this.previousModelSelection(this.formOneData,true)
    }
  }

  async screenInputDetails(data:any){
    this.formTwoData = {formOneData: this.formOneData, formTwoData: data};
    const currentStep:any = localStorage.getItem('step')
    this.step = parseInt(currentStep) + 1;
    localStorage.setItem('step',`${this.step}`);
    this.calculationService.checkStepStatus.next({status:true,step:this.step})
    this.nextModelSelection();
  }

  async groupReviewControls(data:any){
    this.transferStepperthree= {formOneAndThreeData:this.formOneAndThreeData ? this.formOneAndThreeData :  this.formFiveData?.formOneAndThreeData,formFourData:data,formTwoData:this.formTwoData};
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step')
    // const currentStep:any = await this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
    this.step=parseInt(currentStep)
    this.calculationService.checkStepStatus.next({status:true,step:this.step})
  }

  async resultData(data:any){
    // this.stepper.next();
    const currentStep:any = localStorage.getItem('step');
    // const currentStep:any = await this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
    this.step = parseInt(currentStep) + 1;
    localStorage.setItem('step',`${this.step}`);
    // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),this.step);
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
  ruleElevenUaDetails(data:any){
    this.ruleElevenData=data;
    this.nextModelSelection(data.status);
    this.onStepChange();
  }

  async nextModelSelection(data?:any){
    const model = this.formOneData?.model;

    if(!model)
      return

    const currentModel =this.formOneData?.model[model?.indexOf(data)+1];
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
        case 'ruleElevenUa':
          this.next = 7;
          break;
        default:
          // this.stepper.next(); 
          const currentStep:any = localStorage.getItem('step')
          // const currentStep:any = await this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
          this.step = parseInt(currentStep) + 1;
          localStorage.setItem('step',`${this.step}`)
          // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),this.step);
          this.calculationService.checkStepStatus.next({stepStatus:false,step:this.step})
      
    }
  }
  
  async previousModelSelection(modelName?:string,isProcessState?:boolean){
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
       case 'ruleElevenUa':
         this.next = 7;
         break;
       default:
        // this.stepper.previous(); 
        const currentStep:any = localStorage.getItem('step')
        // const currentStep:any = await this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
        this.step = parseInt(currentStep) - 1;
        localStorage.setItem('step',`${this.step}`)
        // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),this.step);
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
  ruleElevenUaDetailsPrev(data:any){
    this.previousModelSelection(data?.status);
  }

  ifModelExist(name:string, modelArray:any){
    if(modelArray)
      return isSelected(name,modelArray);
    return false;
  }

   loadStateByProcessId(processStateId:string){
    this.isProcessExistLoader = true;
    this.processLoader = true;
    this.processStatusManagerService.retrieveProcess(processStateId).subscribe(async (processInfo:any)=>{
      if(processInfo.status){
        const processStateDetails = processInfo.stateInfo;
        this.step = localStorage.setItem('step',`${processStateDetails.step}`)
        // this.step = await this.fetchProcessActiveStage(processStateDetails._id)

        if(processStateDetails?.firstStageInput){
          // console.log(processStateDetails.firstStageInput.formFillingStatus,"form one stats")
          // localStorage.setItem('stepOneStats',`${processStateDetails.firstStageInput.formFillingStatus}`)
          this.groupModelControls(processStateDetails.firstStageInput,true)
        }

        if(processStateDetails?.firstStageInput || processStateDetails?.secondStageInput){
          this.formTwoData = {formOneData :this.formOneData, formTwoData: processStateDetails.secondStageInput};
        }
        if(processStateDetails?.thirdStageInput){
          this.formThreeData = processStateDetails.thirdStageInput;
        }

        if(processStateDetails?.thirdStageInput && processStateDetails?.firstStageInput){
          this.formFourData = {formOneData:processStateDetails.firstStageInput,formThreeData: this.formThreeData,formFourData:processStateDetails?.fourthStageInput};
        }

        if(processStateDetails?.fourthtageInput || processStateDetails?.thirdStageInput){
          let updatedPayload:any;
          this.formThreeData.map((formTwoDetails:any)=>{
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
            if(formTwoDetails.model === MODELS.RULE_ELEVEN_UA && processStateDetails?.firstStageInput.model.includes(MODELS.RULE_ELEVEN_UA)){
              const {model , ...rest} = formTwoDetails;
              updatedPayload = {...processStateDetails?.firstStageInput,...rest,...updatedPayload}
            }
          }) 
          this.formFiveData = {formOneAndThreeData : updatedPayload,formFourData:processStateDetails.fourthStageInput,formFiveData:processStateDetails?.fifthStageInput?.totalWeightageModel};
        }
        if(processStateDetails?.fifthStageInput || processStateDetails?.sixthStageInput){
          this.formSixData = {...this.formFiveData,formFiveData : processStateDetails.fifthStageInput?.totalWeightageModel,formSixData:processStateDetails?.sixthStageInput}
        }

        this.isProcessExistLoader = false;
        this.processLoader = false;
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

  // async fetchProcessActiveStage(processId: any) {
  //   try {
  //     const response: any = await this.processStatusManagerService.retrieveActiveStage(processId).toPromise();
  
  //     if (response.status) {
  //       const processStageData = response?.data;
  //       const step = processStageData.step;
  //       return step;
  
  //       // Do more processing with the step here if needed
  //     } else {
  //       this.snackBar.open('Stage retrieve failed', 'ok', {
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: 'app-notification-error'
  //       });
  //     }
  //   } catch (error) {
  //     this.snackBar.open(`${error}`, 'ok', {
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //       duration: 3000,
  //       panelClass: 'app-notification-error'
  //     });
  //   }
  // }

  // async updateProcessActiveStage(processId: any, step: any) {
  //   try {
  //     const data = {
  //       processId: processId,
  //       step: step
  //     };
  
  //     const response: any = await this.processStatusManagerService.updateActiveStage(data).toPromise();
  
  //     if (response.status) {
  //       const processStageData = response?.data;
  //       console.log(processStageData, "updated stage data");
  //       return processStageData.step;
  //     } else {
  //       this.snackBar.open('Stage update failed', 'ok', {
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: 'app-notification-error'
  //       });
  //     }
  //   } catch (error) {
  //     this.snackBar.open(`${error}`, 'ok', {
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //       duration: 3000,
  //       panelClass: 'app-notification-error'
  //     });
  //   }
  // }

  getTotalSteps(){
    let totalSteps = false;
    this.calculationService.checkModel.subscribe((data)=>{
      if (data?.status) {
        totalSteps =  false;
      } else {
        totalSteps =  true;
      }
    })
    return totalSteps;
  }
}

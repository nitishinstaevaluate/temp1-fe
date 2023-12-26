import { Component,OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';

@Component({
  selector: 'app-navbar-details',
  templateUrl: './navbar-details.component.html',
  styleUrls: ['./navbar-details.component.scss']
})
export class NavbarDetailsComponent implements OnInit{

  selectedMenuItem:any=1;
  stepStatusOfOne:any;
  stepStatusOfTwo:any='';
  stepStatusOfThree:any='';
  stepStatusOfFour:any='';
  stepStatusOfFive:any='';
  currentStep:any=''
  constructor(
    private calculationService:CalculationsService,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

  ngOnInit(): void {
    // localStorage.setItem('step','1')
    // localStorage.removeItem('stepOneStats')
    localStorage.removeItem('stepTwoStats')
    localStorage.removeItem('stepThreeStats')
    localStorage.removeItem('stepFourStats')
    localStorage.removeItem('stepFiveStats')
    localStorage.removeItem('pendingStat')

     this.checkProcessState();
  }

async checkProcessState(){
    
    if(localStorage.getItem('processStateId')){

      this.processStatusManagerService.retrieveProcess(localStorage.getItem('processStateId')).subscribe((processInfo:any)=>{
        if(processInfo.status){
          const processStateDetails = processInfo.stateInfo;
          const step = processStateDetails.step;
          const modelsSelected = processStateDetails.firstStageInput.model;
          // localStorage.setItem('stepOneStats',`${processStateDetails.firstStageInput.formFillingStatus}`)
          if(modelsSelected.length){
            const modelInputStages = processStateDetails.secondStageInput;
            let formTwoFillingStatus = false;
            if(modelInputStages.length){

               formTwoFillingStatus = modelInputStages.every((stateTwoDetails:any)=>{return stateTwoDetails.formFillingStatus});
               if(formTwoFillingStatus){
                 localStorage.setItem('stepTwoStats','true')
               }
               else{
                 localStorage.setItem('stepTwoStats','false')
               }
            }
          }
          const stateThreeDetails  = processStateDetails?.thirdStageInput?.formFillingStatus;
          if(stateThreeDetails){
            localStorage.setItem('stepThreeStats',`${stateThreeDetails}`)
          }

          const stateFourDetails  = processStateDetails?.fourthStageInput?.formFillingStatus;
          if(stateFourDetails){
            localStorage.setItem('stepFourStats',`${stateFourDetails}`)
          }
          const stateFiveDetails  = processStateDetails?.fifthStageInput?.formFillingStatus;
          if(stateFiveDetails){
            localStorage.setItem('stepFiveStats',`${stateFiveDetails}`)
          }
          this.checkstepStat()
          this.selectedMenuItem = step
        }
      })
    }
    else{
    localStorage.setItem('step','1');
    // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),1)
      this.checkstepStat();
    }
  }
  async selectMenuItem(route: string) {
    this.selectedMenuItem = route;
    this.currentStep = route;
    localStorage.setItem('step',route);
    // await this.updateProcessActiveStage(localStorage.getItem('processStateId'),route)
    this.calculationService.steps.next(parseInt(route));
  }

  checkstepStat(){
    this.calculationService.checkStepStatus.subscribe(async (response)=>{
      this.currentStep = localStorage.getItem('step');
      // this.currentStep = await this.fetchProcessActiveStage(localStorage.getItem('processStateId'));
      // console.log(this.currentStep," navbar step")
      if(parseInt(this.currentStep) === 1){
        this.bindStatusToNavbar(this.currentStep);
      }

      if(parseInt(this.currentStep) === 2){
        this.bindStatusToNavbar(this.currentStep);
      }

      if(parseInt(this.currentStep) === 3){
        this.bindStatusToNavbar(this.currentStep);
      }
      if(parseInt(this.currentStep) === 4){
        this.bindStatusToNavbar(this.currentStep);
      }
      if(parseInt(this.currentStep) === 5){
        this.bindStatusToNavbar(this.currentStep);
      }
    })
  }

  bindStatusToNavbar(currentStep:any){
         this.selectedMenuItem = parseInt(currentStep);
        const stepOneStat = localStorage.getItem('stepOneStats');
        const stepTwoStat = localStorage.getItem('stepTwoStats');
        const stepThreeStat = localStorage.getItem('stepThreeStats');
        const stepFourStat = localStorage.getItem('stepFourStats');
        const stepFiveStat = localStorage.getItem('stepFiveStats');
        this.stepStatusOfOne = stepOneStat;
        this.stepStatusOfTwo = stepTwoStat;
        this.stepStatusOfThree = stepThreeStat;
        this.stepStatusOfFour = stepFourStat;
        this.stepStatusOfFive = stepFiveStat;
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
  //       // console.log(processStageData, "updated stage data");
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
}

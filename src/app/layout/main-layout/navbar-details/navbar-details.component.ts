import { Component,OnInit } from '@angular/core';
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
    private processStatusManagerService:ProcessStatusManagerService){}

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

 checkProcessState(){
    
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
          this.checkstepStat()
          this.selectedMenuItem = step
        }
      })
    }
    else{
    localStorage.setItem('step','1');
      this.checkstepStat();
    }
  }
  selectMenuItem(route: string): void {
    this.selectedMenuItem = route;
    this.currentStep = route
    localStorage.setItem('step',route);
    this.calculationService.steps.next(parseInt(route));
  }

  checkstepStat(){
    this.calculationService.checkStepStatus.subscribe((response)=>{
      this.currentStep = localStorage.getItem('step');
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


}

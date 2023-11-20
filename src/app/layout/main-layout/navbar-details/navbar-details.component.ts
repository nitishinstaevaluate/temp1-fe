import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalculationsService } from 'src/app/shared/service/calculations.service';

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
  constructor(private router:Router,private calculationService:CalculationsService){}

  ngOnInit(): void {
    localStorage.setItem('step','1');
    localStorage.removeItem('stepOneStats')
    localStorage.removeItem('stepTwoStats')
    localStorage.removeItem('stepThreeStats')
    localStorage.removeItem('stepFourStats')
    localStorage.removeItem('stepFiveStats')
    localStorage.removeItem('pendingStat')
    this.calculationService.checkStepStatus.subscribe((response)=>{
      // console.log(response,"response stepper")
      const currentStep:any = localStorage.getItem('step');
      if(parseInt(currentStep) === 1){
        this.bindStatusToNavbar(currentStep);
      }

      if(parseInt(currentStep) === 2){
        this.bindStatusToNavbar(currentStep);
      }

      if(parseInt(currentStep) === 3){
        this.bindStatusToNavbar(currentStep);
      }
      if(parseInt(currentStep) === 4){
        this.bindStatusToNavbar(currentStep);
      }
      if(parseInt(currentStep) === 5){
        this.bindStatusToNavbar(currentStep);
      }
    })
  }
  selectMenuItem(route: string): void {
    this.selectedMenuItem = route;
    localStorage.setItem('step',route);
    this.calculationService.steps.next(parseInt(route));
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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { INDUSTRY_BASED_COMPANY } from 'src/app/shared/enums/constant';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-screen-input-details',
  templateUrl: './screen-input-details.component.html',
  styleUrls: ['./screen-input-details.component.scss']
})
export class ScreenInputDetailsComponent implements OnInit,OnChanges {
  @Input() step:any;
  @Output() screenInputDetails:any = new EventEmitter<any>();
  @Output() previousPage:any = new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() secondStageInput:any;
  inputScreenForm:any;
  hasError=hasError;
  modelControl=groupModelControl;
  ciqIndustryData:any;
  ciqIndustryHead=['Company Id', 'Company Name', 'Industry id', 'Industry Description'];
  mapIndustryBasedCompany:any = INDUSTRY_BASED_COMPANY;
  loader=false;

  constructor(
    private fb:FormBuilder,
    private ciqSpService:CiqSPService,
    private calculationService:CalculationsService,
    private processStatusManagerService: ProcessStatusManagerService,
    private snackBar: MatSnackBar){}

  ngOnInit(){
    this.loadForm()
  }
  ngOnChanges() {
    if(!this.formOneData){
      const industry = this.secondStageInput?.formOneData?.industry;
      const location = this.secondStageInput?.formOneData?.location;
      if(industry && location){
        this.loadCiqIndustry(industry, location);
      }
    }
    else {
      const industry = this.formOneData?.industry;
      const location = this.formOneData?.location;
      if(industry && location){
        this.loadCiqIndustry(industry, location);
      }
    }
  }

  loadForm(){
    this.inputScreenForm = this.fb.group({
      companyStatus:['', [Validators.required]],
      descriptor:['', [Validators.required]],
      industryL3:['', [Validators.required]],
      industryL4:['', [Validators.required]],
    })
  }

  saveAndNext(){
    localStorage.setItem('stepTwoStats',`true`)
    this.screenInputDetails.emit({formFillingStatus:true});
    this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
    const processStateModel ={
      secondStageInput:{formFillingStatus:true},
      step:2
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))
  }
  previous(){
    this.previousPage.emit(true)
  }

  loadCiqIndustry(industry:any,location:any){
    this.loader = true;
    this.ciqSpService.getSPCompanyBasedIndustry(industry,location).subscribe((ciqIndustry:any)=>{
      if(ciqIndustry.status){
        this.loader = false;
        this.ciqIndustryData = ciqIndustry?.data;
      }
      else{
        this.loader = false;
        this.snackBar.open(`industry not found`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        },);
      }
    },(error)=>{
      this.loader = false;
      this.snackBar.open(`${error}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      },); 
    })
  }

  processStateManager(process:any, processId:any){
    this.processStatusManagerService.instantiateProcess(process, processId).subscribe(
      (processStatusDetails: any) => {
        if (processStatusDetails.status) {
          localStorage.setItem('processStateId', processStatusDetails.processId);
        }
      },
      (error) => {
        this.snackBar.open(`${error.message}`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        });
      }
    );
  }

  isIndustryId(row:any){
    console.log(row,"row data")
    if(row === INDUSTRY_BASED_COMPANY[2]){
      return true;
    }
    return false;
  }
}

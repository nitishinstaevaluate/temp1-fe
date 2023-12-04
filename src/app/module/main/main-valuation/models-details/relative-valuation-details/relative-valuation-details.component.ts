import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormArray, FormBuilder,FormControl,Validators } from '@angular/forms';
import { MODELS } from 'src/app/shared/enums/constant';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-relative-valuation-details',
  templateUrl: './relative-valuation-details.component.html',
  styleUrls: ['./relative-valuation-details.component.scss']
})
export class RelativeValuationDetailsComponent implements OnInit,OnChanges {

  modelControl = groupModelControl;
  @Input() formOneData:any;
  @Input() secondStageInput:any;
  @Output() relativeValDetailsPrev = new EventEmitter<any>();
  @Output() relativeValDetails = new EventEmitter<any>();

  relativeValuation:any;
  MODEL=MODELS;
  industries:any=[];

  floatLabelType:any='never';
  constructor(private formBuilder:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

  ngOnChanges(){
    this.loadFormControl();
    if(this.formOneData){
      // this.addInput()
      // this.addInput()
      // this.addInput()
      if(this.formOneData?.preferenceCompanies && this.formOneData.model.includes('Relative_Valuation')){
       
        this.Companies.controls[0]?.patchValue(this.formOneData?.preferenceCompanies[0]);
        this.Companies.controls[1]?.patchValue(this.formOneData?.preferenceCompanies[1]);
        this.Companies.controls[2]?.patchValue(this.formOneData?.preferenceCompanies[2]);
      }
      this.formOneData?.preferenceCompanies.map((prefCompany:any,prefCompanyIndex:number)=>{
          this.addInput();
          this.Companies.controls[prefCompanyIndex]?.setValue(this.formOneData?.preferenceCompanies[prefCompanyIndex]);
      })
    }
  }

  isRelativeValuation(value:string){
    return this.formOneData?.model.includes(value) ? true :false;
  }
  ngOnInit(): void {
    this.loadFormControl();
    this.checkProcessExist();
  }

  checkProcessExist(){
    if(this.secondStageInput){
      this.secondStageInput.map((stateTwoDetails:any)=>{
        if(stateTwoDetails.model === MODELS.RELATIVE_VALUATION && this.formOneData.model.includes(MODELS.RELATIVE_VALUATION)){
          stateTwoDetails?.companies.map((companyDetails:any,i:number)=>{
            this.formOneData?.preferenceCompanies.map((prefCompany:any,prefCompanyIndex:number)=>{
              if(prefCompany.company === companyDetails.company){
                this.addInput();
                this.Companies.controls[i]?.setValue(this.formOneData?.preferenceCompanies[prefCompanyIndex]);
              }
            })
          })
        }
      })
    }
  }

loadFormControl(){
    this.relativeValuation=this.formBuilder.group({
      preferenceRatioSelect:['Company Based',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([])
    })
  }

  get Companies() {
    return this.relativeValuation?.controls['companies'] as FormArray;
  }
  get Industries() {
    return this.relativeValuation?.controls['industries'] as FormArray;
  }
  removeField(i: any) {
    this.Companies.controls.splice(i, 1);
    this.relativeValuation.controls['companies'].value.splice(i,1)
  }
  addInput() {
    this.Companies.push(new FormControl(null));
  }
  removeFieldIndustry(i: any) {
   this.Industries.controls.splice(i,1)
  }
  addInputIndustry() {
    this.Industries.push(new FormControl(null));
  }

  previous(){
    this.relativeValDetailsPrev.emit({status:MODELS.RELATIVE_VALUATION})
  }


  saveAndNext(){
    if (this.isRelativeValuation(this.MODEL.RELATIVE_VALUATION)) {
      this.industries = this.formOneData?.industriesRatio;
    }
    localStorage.setItem('stepTwoStats','true')

    const processStateModel ={
      secondStageInput:[{model:MODELS.RELATIVE_VALUATION,...this.relativeValuation.value,industries:this.industries,formFillingStatus:true}],
      step:localStorage.getItem('step')
    }

    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));

    this.relativeValDetails.emit({...this.relativeValuation.value,status:MODELS.RELATIVE_VALUATION,industries:this.industries})
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
}

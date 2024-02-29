import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { MODELS } from 'src/app/shared/enums/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-comparable-industries-details',
  templateUrl: './comparable-industries-details.component.html',
  styleUrls: ['./comparable-industries-details.component.scss']
})
export class ComparableIndustriesDetailsComponent implements OnChanges,OnInit {

  modelControl = groupModelControl;
  @Input() formOneData:any;
  @Input() thirdStageInput:any;
  @Output() comparableIndustriesDetailsPrev = new EventEmitter<any>();
  @Output() comparableIndustriesDetails = new EventEmitter<any>();
  
  MODEL=MODELS;
  floatLabelType:any='never';

  comparableIndustries:any;
  industries:any=[];

  constructor(private formBuilder:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

  loadFormControl(){
    this.comparableIndustries=this.formBuilder.group({
      preferenceRatioSelect:['Industry Based',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([])
    })
  }
  ngOnChanges(){
    this.formOneData;
  }
  isRelativeValuation(value:string){
    return this.formOneData?.model?.includes(value) ? true :false;
  }
  ngOnInit(): void {
    this.loadFormControl();
    this.checkProcessExist();
  }
  checkProcessExist(){
    if(this.thirdStageInput){
      this.thirdStageInput.map((stateThreeDetails:any)=>{
        if(stateThreeDetails.model === MODELS.COMPARABLE_INDUSTRIES && this.formOneData.model.includes(MODELS.COMPARABLE_INDUSTRIES)){
          this.industries = stateThreeDetails.industries;
        }
      })
    }
  }
  previous(){
    this.comparableIndustriesDetailsPrev.emit({status:MODELS.COMPARABLE_INDUSTRIES})
  }

  saveAndNext(){
      this.industries = this.formOneData?.industriesRatio;
      const processStateModel ={
        thirdStageInput:[{model:MODELS.COMPARABLE_INDUSTRIES,...this.comparableIndustries.value,industries:this.industries,formFillingStatus:true}],
        step:localStorage.getItem('step')
      }
      this.processStateManager(processStateModel,localStorage.getItem('processStateId'));

      this.comparableIndustriesDetails.emit({...this.comparableIndustries.value,status:MODELS.COMPARABLE_INDUSTRIES,industries:this.industries})
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
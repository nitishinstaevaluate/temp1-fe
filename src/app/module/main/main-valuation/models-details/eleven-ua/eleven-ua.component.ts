import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { MODELS } from 'src/app/shared/enums/constant';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNotRuleElevenUaAndNav } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-eleven-ua',
  templateUrl: './eleven-ua.component.html',
  styleUrls: ['./eleven-ua.component.scss']
})
export class ElevenUAComponent implements OnInit, OnChanges{
  modelControl = groupModelControl
  ruleElevenUaForm: any;
  hasError = hasError;
  @Output() ruleElevenUaDetails=new EventEmitter<any>();
  @Output() ruleElevenUaDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() thirdStageInput:any;
  modelValue:any = [];
  
  constructor(
    private fb: FormBuilder,
    private processStatusManagerService: ProcessStatusManagerService,
    private snackBar: MatSnackBar
    ){}

  ngOnInit() {
    this.loadForm();
    this.checkProcessExist();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkPreviousAndCurrentValue(changes);
  }

  loadForm(){
    this.ruleElevenUaForm = this.fb.group({
      fairValueJewellery: ['',[Validators.required]],
      fairValueArtistic: ['',[Validators.required]],
      fairValueImmovableProp: ['',[Validators.required]],
      fairValueinvstShareSec: ['',[Validators.required]],
      contingentLiability: ['',[Validators.required]],
      otherThanAscertainLiability: ['',[Validators.required]],
      phaseValue: ['',[Validators.required]],
    })
  }

  checkProcessExist(){
    if(this.thirdStageInput){
      this.thirdStageInput.map((stateThreeDetails:any)=>{
        if(stateThreeDetails.model === MODELS.RULE_ELEVEN_UA && this.formOneData.model.includes(MODELS.RULE_ELEVEN_UA)){
          this.ruleElevenUaForm.controls['fairValueJewellery'].setValue(stateThreeDetails?.fairValueJewellery) 
          this.ruleElevenUaForm.controls['fairValueArtistic'].setValue(stateThreeDetails?.fairValueArtistic) 
          this.ruleElevenUaForm.controls['fairValueImmovableProp'].setValue(stateThreeDetails?.fairValueImmovableProp) 
          this.ruleElevenUaForm.controls['fairValueinvstShareSec'].setValue(stateThreeDetails?.fairValueinvstShareSec); 
          this.ruleElevenUaForm.controls['contingentLiability'].setValue(stateThreeDetails?.contingentLiability);
          this.ruleElevenUaForm.controls['otherThanAscertainLiability'].setValue(stateThreeDetails?.otherThanAscertainLiability);
          this.ruleElevenUaForm.controls['phaseValue'].setValue(stateThreeDetails?.phaseValue);
        }
      })
    }
  }

  previous(){
    const checkModel = isNotRuleElevenUaAndNav(this.modelValue);
    if(!checkModel){
      localStorage.setItem('step', '2')
    }
    this.ruleElevenUaDetailsPrev.emit({status:'ruleElevenUa'})
  }

  saveAndNext(){
    localStorage.setItem('stepTwoStats','true')
    const processStateModel ={
      secondStageInput:[{model:MODELS.RULE_ELEVEN_UA,...this.ruleElevenUaForm.value,formFillingStatus:true,status:MODELS.RULE_ELEVEN_UA}],
      step:2
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));
    this.ruleElevenUaDetails.emit( {...this.ruleElevenUaForm.value,status:MODELS.RULE_ELEVEN_UA} );
  }

  checkPreviousAndCurrentValue(changes:any){
    if (this.formOneData && changes['formOneData'] ) {
      this.modelValue = changes['formOneData'].currentValue.model;
    }
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

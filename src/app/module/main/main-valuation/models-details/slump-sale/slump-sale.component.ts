import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { MODELS } from 'src/app/shared/enums/constant';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isSelected } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-slump-sale',
  templateUrl: './slump-sale.component.html',
  styleUrls: ['./slump-sale.component.scss']
})
export class SlumpSaleComponent implements OnInit, OnChanges{
  modelControl = groupModelControl
  slumpSaleForm: any;
  hasError = hasError;
  @Output() slumpSaleDetails=new EventEmitter<any>();
  @Output() slumpSaleDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() thirdStageInput:any;
  modelValue:any = [];
  constructor(
    private fb: FormBuilder,
    private processStatusManagerService: ProcessStatusManagerService,
    private snackBar: MatSnackBar){}

  ngOnInit() {
    this.loadForm();
    this.checkProcessExist();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkPreviousAndCurrentValue(changes);
  }

  loadForm(){
    this.slumpSaleForm = this.fb.group({
      monetaryConsiderationValue: ['',[Validators.required]],
      nonMonetaryConsiderationUnderSubRule: ['',[Validators.required]],
      nonMonetaryConsiderationNotUnderSubRule: ['',[Validators.required]],
      valueAssessedByGov: ['',[Validators.required]],
    })
  }

  checkProcessExist(){
    if(this.thirdStageInput){
      this.thirdStageInput.map((stateThreeDetails:any)=>{
        if(stateThreeDetails.model === MODELS.SLUMP_SALE && this.formOneData.model.includes(MODELS.SLUMP_SALE)){
          this.slumpSaleForm.controls['monetaryConsiderationValue'].setValue(stateThreeDetails?.monetaryConsiderationValue) 
          this.slumpSaleForm.controls['nonMonetaryConsiderationUnderSubRule'].setValue(stateThreeDetails?.nonMonetaryConsiderationUnderSubRule) 
          this.slumpSaleForm.controls['nonMonetaryConsiderationNotUnderSubRule'].setValue(stateThreeDetails?.nonMonetaryConsiderationNotUnderSubRule) 
          this.slumpSaleForm.controls['valueAssessedByGov'].setValue(stateThreeDetails?.valueAssessedByGov);
        }
      })
    }
  }

  previous(){
    const checkModel = this.modelValue.includes(MODELS.SLUMP_SALE);
    if(checkModel){
      localStorage.setItem('step', '2')
    }
    this.slumpSaleDetailsPrev.emit({status:MODELS.SLUMP_SALE})
  }

  saveAndNext(){
    localStorage.setItem('stepThreeStats','true')
    const processStateModel ={
      thirdStageInput:[{model:MODELS.SLUMP_SALE,...this.slumpSaleForm.value,formFillingStatus:true,status:MODELS.SLUMP_SALE}],
      step:3
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));
    this.slumpSaleDetails.emit( {...this.slumpSaleForm.value,status:MODELS.SLUMP_SALE} );
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

  clearInput(controlName:string){
    this.slumpSaleForm.controls[controlName].setValue('');
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { MODELS } from 'src/app/shared/enums/constant';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-eleven-ua',
  templateUrl: './eleven-ua.component.html',
  styleUrls: ['./eleven-ua.component.scss']
})
export class ElevenUAComponent implements OnInit{
  modelControl = groupModelControl
  ruleElevenUaForm: any;
  hasError = hasError;
  @Output() ruleElevenUaDetails=new EventEmitter<any>();
  @Output() ruleElevenUaDetailsPrev=new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() secondStageInput:any;
  
  constructor(
    private fb: FormBuilder,
    private processStatusManagerService: ProcessStatusManagerService,
    private snackBar: MatSnackBar
    ){}

  ngOnInit() {
    this.loadForm()
  }
  loadForm(){
    this.ruleElevenUaForm = this.fb.group({
      fairValueJewellery: ['',[Validators.required]],
      fairValueArtistic: ['',[Validators.required]],
      fairValueImmovableProp: ['',[Validators.required]],
      fairValueinvstShareSec: ['',[Validators.required]],
      contingentLiability: ['',[Validators.required]]
    })
  }

  previous(){
    this.ruleElevenUaDetailsPrev.emit({status:'ruleElevenUa'})
  }

  saveAndNext(){
    localStorage.setItem('stepTwoStats','true')
    const processStateModel ={
      secondStageInput:[{model:MODELS.RULE_ELEVEN_UA,...this.ruleElevenUaForm.value,formFillingStatus:true}],
      step:2
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));
    this.ruleElevenUaDetails.emit( {...this.ruleElevenUaForm.value,status:'ruleElevenUa'} );
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

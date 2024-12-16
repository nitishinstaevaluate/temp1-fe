import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import groupModelControl from '../../../../../../../shared/enums/group-model-controls.json';
import { hasError } from 'src/app/shared/enums/errorMethods';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit{
  @Output() berkusStep = new EventEmitter();

  hasError = hasError;
  controls=groupModelControl;
  managementForm:any;
  editedValues:any=[];
  modelValue:any = [];
  managementRegConfig:any=groupModelControl.BERKUS.options.management.controlsConfig;

  constructor(private fb:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(){
    this.managementForm=this.fb.group({});
  
    this.managementRegConfig.forEach((config:any) => {
      if (!config.type) {
        this.managementForm.addControl(config.controlName, new FormControl('',[Validators.required]));
        if(config?.controlNameDoa) this.managementForm.addControl(config.controlNameDoa, new FormControl(0,[Validators.required]));
      }
    });
  }

  submit(){
    this.berkusStep.emit(4);
    console.log(this.managementForm.value,"management")
  }

  previous(){
    this.berkusStep.emit(2)
  }

  clearInput(controlName:string){
    this.managementForm.controls[controlName].setValue('');
  }

  onSelectorChange(controlName:string){
    this.managementForm.controls[controlName].setValue(0);
  }
}

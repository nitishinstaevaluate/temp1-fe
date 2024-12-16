import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { hasError } from 'src/app/shared/enums/errorMethods';

@Component({
  selector: 'app-product-rollout',
  templateUrl: './product-rollout.component.html',
  styleUrls: ['./product-rollout.component.scss']
})
export class ProductRolloutComponent implements OnInit{
@Output() berkusStep = new EventEmitter();

  hasError = hasError;
  controls=groupModelControl;
  productRolloutForm:any;
  productRolloutRegConfig:any=groupModelControl.BERKUS.options.productRollout.controlsConfig;

  constructor(private fb:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

  ngOnInit(): void {
    this.loadForm();
  }
  
  loadForm(){
    this.productRolloutForm=this.fb.group({});
  
    this.productRolloutRegConfig.forEach((config:any) => {
      if (!config.type) {
        this.productRolloutForm.addControl(config.controlName, new FormControl('',[Validators.required]));
        if(config?.controlNameDoa) this.productRolloutForm.addControl(config.controlNameDoa, new FormControl('',[Validators.required]));
      }
    });
  }

  submit(){
    this.berkusStep.emit(6);
    console.log(this.productRolloutForm.value,"product roll out")
  }

  previous(){
    this.berkusStep.emit(4)
  }

  clearInput(controlName:string){
    this.productRolloutForm.controls[controlName].setValue('');
  }

  onSelectorChange(controlName:string){
    this.productRolloutForm.controls[controlName].setValue(0);
  }
}

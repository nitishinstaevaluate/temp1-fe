import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { hasError } from 'src/app/shared/enums/errorMethods';

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit{
  @Output() berkusStep = new EventEmitter();

  hasError = hasError;
  controls=groupModelControl;
  prototypeForm:any;
  prototypeRegConfig:any=groupModelControl.BERKUS.options.prototype.controlsConfig;

  constructor(private fb:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(){
    this.prototypeForm=this.fb.group({});
  
    this.prototypeRegConfig.forEach((config:any) => {
      if (!config.type) {
        this.prototypeForm.addControl(config.controlName, new FormControl('',[Validators.required]));
        if(config?.controlNameDoa) this.prototypeForm.addControl(config.controlNameDoa, new FormControl(0,[Validators.required]));
      }
    });
  }

  submit(){
    this.berkusStep.emit(3);
    console.log(this.prototypeForm.value,"product roll out")
  }

  previous(){
    this.berkusStep.emit(1)
  }

  clearInput(controlName:string){
    this.prototypeForm.controls[controlName].setValue('');
  }

  onSelectorChange(controlDoa:any){
    this.prototypeForm.controls[controlDoa].setValue(0);
  }
}

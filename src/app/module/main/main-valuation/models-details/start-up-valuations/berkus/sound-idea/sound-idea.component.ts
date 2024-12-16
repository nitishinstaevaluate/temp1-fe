import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { hasError } from 'src/app/shared/enums/errorMethods';

@Component({
  selector: 'app-sound-idea',
  templateUrl: './sound-idea.component.html',
  styleUrls: ['./sound-idea.component.scss']
})
export class SoundIdeaComponent implements OnInit {
@Output() berkusStep = new EventEmitter();

hasError= hasError;
controls=groupModelControl;
soundIdeaForm:any;
editedValues:any=[];
modelValue:any = [];
soundIdeaRegConfig:any=groupModelControl.BERKUS.options.soundIdea.controlsConfig;

constructor(private fb:FormBuilder,
  private processStatusManagerService:ProcessStatusManagerService,
  private snackBar:MatSnackBar){}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(){
    this.soundIdeaForm=this.fb.group({});
  
    this.soundIdeaRegConfig.forEach((config:any) => {
      if (!config.type) {
        this.soundIdeaForm.addControl(config.controlName, new FormControl('',[Validators.required]));
        if(config?.controlNameDoa) this.soundIdeaForm.addControl(config.controlNameDoa, new FormControl(0,[Validators.required]));
      }
    });
  }

  onSelectorChange(controlDoa:any){
    this.soundIdeaForm.controls[controlDoa].setValue(0);
  }

  submit(){
    this.berkusStep.emit(2)
    console.log(this.soundIdeaForm.value, "values");
  }

  previous(){
    this.berkusStep.emit(0)
  }

  clearInput(controlName:string){
    this.soundIdeaForm.controls[controlName].setValue('');
  }
}

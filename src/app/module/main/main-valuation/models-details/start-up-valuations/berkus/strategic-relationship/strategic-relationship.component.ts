import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { hasError } from 'src/app/shared/enums/errorMethods';


@Component({
  selector: 'app-strategic-relationship',
  templateUrl: './strategic-relationship.component.html',
  styleUrls: ['./strategic-relationship.component.scss']
})
export class StrategicRelationshipComponent implements OnInit{
  @Output() berkusStep = new EventEmitter();

  hasError = hasError;
  controls=groupModelControl;
  strategicRelationshipForm:any;
  strategicRelationshipRegConfig:any=groupModelControl.BERKUS.options.strategicRelationships.controlsConfig;

  constructor(private fb:FormBuilder,
    private processStatusManagerService:ProcessStatusManagerService,
    private snackBar:MatSnackBar){}

    ngOnInit(): void {
      this.loadForm();
    }
  
    loadForm(){
      this.strategicRelationshipForm=this.fb.group({});
    
      this.strategicRelationshipRegConfig.forEach((config:any) => {
        if (!config.type) {
          this.strategicRelationshipForm.addControl(config.controlName, new FormControl('',[Validators.required]));
          if(config?.controlNameDoa) this.strategicRelationshipForm.addControl(config.controlNameDoa, new FormControl(0,[Validators.required]));
        }
      });
    }
    
  submit(){
    this.berkusStep.emit(5);
    console.log(this.strategicRelationshipForm.value,"strategic relationship out")
  }
  previous(){
    this.berkusStep.emit(3)
  }

  clearInput(controlName:string){
    this.strategicRelationshipForm.controls[controlName].setValue('');
  }

  onSelectorChange(controlName:string){
    this.strategicRelationshipForm.controls[controlName].setValue(0);
  }
}
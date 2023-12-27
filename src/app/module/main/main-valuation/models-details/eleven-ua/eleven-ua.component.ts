import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';

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
  
  constructor(private fb:FormBuilder){}

  ngOnInit() {
    this.loadForm()
  }
  loadForm(){
    this.ruleElevenUaForm = this.fb.group({
      fairValueImmovableProp: ['',[Validators.required]],
      fairValueJewellery: ['',[Validators.required]],
      fairValueArtistic: ['',[Validators.required]],
      fairValueSharesSecurity: ['',[Validators.required]],
      fairValueOthrTangibleAsset: ['',[Validators.required]],
      fairValueinvstShareSec: ['',[Validators.required]],
      fairValueOthrInvstment: ['',[Validators.required]],
    })
  }

  previous(){
    this.ruleElevenUaDetailsPrev.emit({status:'ruleElevenUa'})
  }

  saveAndNext(){
    this.ruleElevenUaDetails.emit( {...this.ruleElevenUaForm.value,status:'ruleElevenUa'} );
  }

}

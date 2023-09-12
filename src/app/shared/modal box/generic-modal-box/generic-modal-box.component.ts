import { Component , ElementRef, Inject, Renderer2, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GLOBAL_VALUES } from '../../enums/constant';
import groupModelControl from '../../enums/group-model-controls.json'


@Component({
  selector: 'app-generic-modal-box',
  templateUrl: './generic-modal-box.component.html',
  styleUrls: ['./generic-modal-box.component.scss']
})
export class GenericModalBoxComponent implements OnInit {
label:string='';
appValues= GLOBAL_VALUES;
floatLabelType:any = 'never'
modelControl=groupModelControl
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private dialogRef:MatDialogRef<GenericModalBoxComponent>){
this.loadModel(data)
}

ngOnInit() {
}

loadModel(data:any){
  if( data === this.appValues.Normal_Tax_Rate.value) return this.label = this.appValues.Normal_Tax_Rate.name;
  if( data === this.appValues.MAT_Rate.value) return this.label = this.appValues.MAT_Rate.name;
  if( data === this.appValues.ANALYST_CONSENSUS_ESTIMATES.value) return this.label = this.appValues.ANALYST_CONSENSUS_ESTIMATES.name;
  if( data === this.appValues.GOING_CONCERN.value) return this.label = this.appValues.GOING_CONCERN.name;
  return ''
}

modalData(val1?:any,val2?:any,knownAs?:string) {
  if(knownAs === 'projection&terminal'){
     this.dialogRef.close({projectionYear:val1?.value,terminalGrowthYear:val2?.value});
  }else if(knownAs === 'taxRate'){
    this.dialogRef.close({taxRate:val1?.value}); 
  }
  else{
    this.dialogRef.close(); 
  }
}
}

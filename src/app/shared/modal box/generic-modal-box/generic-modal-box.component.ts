import { Component , ElementRef, Inject, Renderer2, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GLOBAL_VALUES } from '../../enums/constant';

@Component({
  selector: 'app-generic-modal-box',
  templateUrl: './generic-modal-box.component.html',
  styleUrls: ['./generic-modal-box.component.scss']
})
export class GenericModalBoxComponent implements OnInit {
label:string='';
appValues= GLOBAL_VALUES;
floatLabelType:any = 'never'

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
  return ''
}

modalData(taxRate?:any) {
  this.dialogRef.close(taxRate?.value);
}
}

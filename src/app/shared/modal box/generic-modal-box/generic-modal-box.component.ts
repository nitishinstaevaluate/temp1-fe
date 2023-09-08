import { Component , ElementRef, Inject, Renderer2, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TAX_RATE } from '../../enums/constant';

@Component({
  selector: 'app-generic-modal-box',
  templateUrl: './generic-modal-box.component.html',
  styleUrls: ['./generic-modal-box.component.scss']
})
export class GenericModalBoxComponent implements OnInit {
label:string='';
taxRateValue= TAX_RATE;
floatLabelType:any = 'never'

constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private dialogRef:MatDialogRef<GenericModalBoxComponent>){
this.loadModel(data)
}

ngOnInit() {
}

loadModel(data:any){
  if( data === this.taxRateValue.Normal_Tax_Rate.value) return this.label = this.taxRateValue.Normal_Tax_Rate.name;
  if( data === this.taxRateValue.MAT_Rate.value) return this.label = this.taxRateValue.MAT_Rate.name;
  return ''
}

modalData(taxRate?:any) {
  this.dialogRef.close(taxRate?.value);
}
}

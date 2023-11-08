import { Component , ElementRef, Inject, Renderer2, OnInit, ViewChild,AfterViewInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GLOBAL_VALUES } from '../../enums/constant';
import groupModelControl from '../../enums/group-model-controls.json'
import WebViewer, { Core } from '@pdftron/webviewer';
import PDFNet  from '@pdftron/webviewer';
import { environment } from 'src/environments/environment';
// import {PDFnet,core} from '@pdftron/webviewer/public/core/pdf/PDFNet.js';
// C:\Ifinworth\ifinworth-ui\src\assets\lib\core\pdf\PDFNet.js

@Component({
  selector: 'app-generic-modal-box',
  templateUrl: './generic-modal-box.component.html',
  styleUrls: ['./generic-modal-box.component.scss']
})
export class GenericModalBoxComponent implements OnInit {
  @ViewChild('viewer') viewerRef!: ElementRef;

label:string='';
appValues= GLOBAL_VALUES;
floatLabelType:any = 'never';
modelControl=groupModelControl;
totalCapital:any={
  equityProp:0,
  prefProp:0,
  debtProp:0
}
summationTargetCaps:number=0;
showWebViewer=false;
htmlContent:any='';

  // Quill toolbar options
  quillModules = {
    toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // Basic formatting
    [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
    [{ 'align': [] }], // Text alignment
    ['link', 'image'], // Links and images
    ['clean'], // Remove formatting
  ]
}

constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private dialogRef:MatDialogRef<GenericModalBoxComponent>){
this.loadModel(data);
if(data?.value === this.appValues.PREVIEW_DOC.value){
this.showWebViewer = true;
}
}

ngOnInit() {
}
   ngAfterViewInit() {
    this.webViewer()
}
async webViewer(){
  this.htmlContent = this.data?.dataBlob;
}

loadModel(data:any){
  if( data === this.appValues.Normal_Tax_Rate.value) return this.label = this.appValues.Normal_Tax_Rate.name;
  if( data === this.appValues.MAT_Rate.value) return this.label = this.appValues.MAT_Rate.name;
  if( data === this.appValues.ANALYST_CONSENSUS_ESTIMATES.value) return this.label = this.appValues.ANALYST_CONSENSUS_ESTIMATES.name;
  if( data === this.appValues.GOING_CONCERN.value) return this.label = this.appValues.GOING_CONCERN.name;
  if( data === this.appValues.SPECIFIC_RISK_PREMIUM.value) return this.label = this.appValues.SPECIFIC_RISK_PREMIUM.name;
  if( data === this.appValues.REGISTERED_VALUER_DETAILS.value) return this.label = this.appValues.REGISTERED_VALUER_DETAILS.name;
  if( data === this.appValues.TARGET_CAPITAL_STRUCTURE.value) return this.label = this.appValues.TARGET_CAPITAL_STRUCTURE.name;
  if( data?.value === this.appValues.PREVIEW_DOC.value) return this.label = this.appValues.PREVIEW_DOC.name;
  return '';
}

modalData(data?:any,knownAs?:string) {
  switch (knownAs) {
    case 'projection&terminal':
      this.dialogRef.close({
        projectionYear: data?.projectionYear,
        terminalGrowthYear: data?.terminalGrowthRate
      });
      break;
  
    case 'taxRate':
      this.dialogRef.close({
        taxRate: data?.taxRate
      });
      break;

      case 'analystConsensusEstimates':
        this.dialogRef.close({
          analystConsensusEstimates: `${data?.analystConsensusEstimates}`
        });
        break;

    case 'specificRiskPremium':
      this.dialogRef.close({
        companySize:data?.companySize,
        marketPosition:data?.marketPosition,
        liquidityFactor:data?.liquidityFactor,
        competition:data?.competition
      });
      break;  

    case 'registeredValuer':
      this.dialogRef.close({
        registeredValuerName:data?.registeredValuerName,
        registeredValuerMobileNumber:data?.registeredValuerMobileNumber,
        registeredValuerEmailId:data?.registeredValuerEmailId,
        registeredValuerGeneralAddress:data?.registeredValuerGeneralAddress,
        registeredValuerCorporateAddress:data?.registeredValuerCorporateAddress,
        registeredValuerQualifications:data?.registeredValuerQualifications,
        registeredvaluerDOIorConflict:'no',
        registeredValuerIbbiId:data?.registeredValuerIbbiId,
      });
      break;  

    case 'targetCapitalStructure':
      this.dialogRef.close({
        debtProportion:data?.debtProportion,
        equityProportion:data?.equityProportion,
        preferenceProportion:data?.preferenceProportion,
        totalCapital:this.summationTargetCaps
      });
      break;    
  
    default:
      this.dialogRef.close();
      break;
  }
}

onTargetCapitalChange(control:string,value:string){
  this.totalCapital[`${control}`] = +value;
  this.summationTargetCaps = this.totalCapital.equityProp + this.totalCapital.prefProp + this.totalCapital.debtProp;
}
}

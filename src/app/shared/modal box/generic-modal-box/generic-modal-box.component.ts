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
  if (this.viewerRef && this.viewerRef.nativeElement && this.showWebViewer) {
    const instance = await WebViewer({
      path: '../../../../assets/lib',
      fullAPI:true,
      licenseKey:environment.webViewerLicense, 
    }, this.viewerRef.nativeElement);
      
    const blob = new Blob([this.data.dataBlob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const blobUrl = URL.createObjectURL(blob);
    instance.UI.loadDocument(
      blobUrl,
      {
        filename: 'report.docx',
        enableOfficeEditing: true,
      });

      const { documentViewer, annotationManager } = instance.Core;

      instance.UI.disableElements(['menuButton'])
    
      instance.UI.setHeaderItems(header => {
        header.push({
            type: 'actionButton',
            // img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            img:'../../../../assets/save-file-logo.gif',
            onClick: async () => 
            {
              const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              const data = await doc.getFileData({
                // saves the document with annotations in it
                xfdfString
              });
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: 'application/docx' });
              const url = URL.createObjectURL(blob);
              // window.open(url);
            }
        });
      });
    
  } else {
    console.error('Viewer element not found or not initialized.');
  }
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

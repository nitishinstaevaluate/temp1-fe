import { Component , ElementRef, Inject, Renderer2, OnInit, ViewChild,AfterViewInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GLOBAL_VALUES, INCOME_APPROACH, MARKET_APPROACH, NET_ASSET_APPROACH } from '../../enums/constant';
import groupModelControl from '../../enums/group-model-controls.json'
import WebViewer, { Core } from '@pdftron/webviewer';
import PDFNet  from '@pdftron/webviewer';
import { environment } from 'src/environments/environment';
import { GET_TEMPLATE } from '../../enums/functions';
import { ValuationService } from '../../service/valuation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
// import {PDFnet,core} from '@pdftron/webviewer/public/core/pdf/PDFNet.js';
// C:\Ifinworth\ifinworth-ui\src\assets\lib\core\pdf\PDFNet.js

@Component({
  selector: 'app-generic-modal-box',
  templateUrl: './generic-modal-box.component.html',
  styleUrls: ['./generic-modal-box.component.scss']
})
export class GenericModalBoxComponent implements OnInit {
  @ViewChild('viewer') viewerRef!: ElementRef;

  terminalGrowthRateControl: FormControl = new FormControl('');

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
models:any=[];
fcfeSelectedModel:any='';
fcffSelectedModel:any='';
excessEarningSelectedModel:any='';
navSelectedModel:any='';
ctmSelectedModel:any='';
ccmSelectedModel:any='';
marketPriceSelectedModel:any = '';
projectionYearSelect:any='';
terminalGrowthRates:any='';
projectionYears:any;
incomeApproachmodels:any=[];
netAssetApproachmodels:any=[];
marketApproachmodels:any=[];
files:any=[];
excelSheetId:any;
fileName:any;

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
private dialogRef:MatDialogRef<GenericModalBoxComponent>,
private valuationService:ValuationService,
private snackBar:MatSnackBar){
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
  if( data?.value === this.appValues.VALUATION_METHOD.value) {
    this.patchExistingValue(data);
    return this.label = this.appValues.VALUATION_METHOD.name;
  }
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

createModelControl(modelName:string,approach:string){
    if(approach === 'incomeApproach'){
      if(!this.incomeApproachmodels.includes(modelName)){
        this.incomeApproachmodels=[];
        this.incomeApproachmodels.push(modelName);
      }
      else{
        this.incomeApproachmodels=[];
        this.clearModelRadioButton(modelName);
      }
    }

    if(approach === 'netAssetValueApproach'){
     if(!this.netAssetApproachmodels.includes(modelName)){
      this.netAssetApproachmodels=[];
      this.netAssetApproachmodels.push(modelName);
    }
    else{
      this.netAssetApproachmodels=[];
      this.clearModelRadioButton(modelName)
    }
  }
  if(approach === 'marketApproach'){
    if(!this.marketApproachmodels.includes(modelName)){
      this.marketApproachmodels=[];
      this.marketApproachmodels.push(modelName);
    }
    else{
      this.marketApproachmodels=[];
      this.clearModelRadioButton(modelName)
    }
  }
}

selectProjections(projectionName:string,approach:string){
   if(approach === 'projectionSelection'){
    if(this.projectionYearSelect === projectionName){
      this.projectionYearSelect=null
    }
    else{

      this.projectionYearSelect = projectionName
    }
  }
  
}

projectionYear(value:any){
  this.projectionYears = value;
}

submitModelValuation(){
  this.models=[...this.incomeApproachmodels,...this.netAssetApproachmodels,...this.marketApproachmodels];

  this.dialogRef.close({
    model:this.models,
    projectionYearSelect:this.projectionYearSelect ?? '',
    terminalGrowthRate:this.terminalGrowthRateControl.value ?? '',
    projectionYears:this.projectionYears ?? '',
    excelSheetId:this.excelSheetId ?? '',
    fileName:this.fileName ?? ''
  })
}

clearModelRadioButton(modelName:string){
  switch(modelName){
    case 'FCFE':
      this.fcfeSelectedModel = null;
      break;

    case 'FCFF':
      this.fcffSelectedModel = null;
      break;

    case 'Excess_Earnings':
      this.excessEarningSelectedModel = null;
      break;

    case 'NAV':
      this.navSelectedModel = null;
      break;

    case 'CTM':
      this.ctmSelectedModel = null;
      break;

    case 'CCM':
      this.ccmSelectedModel = null;
      break;

    case 'Market_Price':
      this.marketPriceSelectedModel = null;
      break;

  }
}

get downloadTemplate() {
  return GET_TEMPLATE(this.projectionYears);
  }

  onFileSelected(event: any) {
    console.log(event,"file event")
    if (event && event.target.files && event.target.files.length > 0) {
      this.files = event.target.files;
      this.fileName = this.files[0].name;
    // console.log(fileName, "file name");/
    }
  
    if (this.files.length === 0) {
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.files[0]);
    // console.log(formData,"all fiels")
    this.valuationService.fileUpload(formData).subscribe((res: any) => {
      this.excelSheetId = res.excelSheetId;
      if(res.excelSheetId){
        // this.isExcelReupload = true;
        this.snackBar.open('File has been uploaded successfully','Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      }
      
      // Clear the input element value to allow selecting the same file again
      event.target.value = '';
    });
  }

  patchExistingValue(data:any){
    if(data?.model.length>0){
      for(const ele of data.model){
        switch(ele){
          case 'FCFE':
            this.fcfeSelectedModel = true;
            break;
          case 'FCFF':
            this.fcffSelectedModel = true;
            break;
          case 'Excess_Earnings':
            this.excessEarningSelectedModel = true;
            break;
          case 'NAV':
            this.navSelectedModel = true;
            break;
          case 'CTM':
            this.ctmSelectedModel = true;
            break;
          case 'CCM':
            this.ccmSelectedModel = true;
            break;
          case 'Market_Price':
            this.marketPriceSelectedModel = true;
            break;
        }

        for(const incApproachMethods of INCOME_APPROACH){
          if(ele === incApproachMethods){
            this.incomeApproachmodels.push(ele);
          }
        }
        for(const netAssetApproachMethods of NET_ASSET_APPROACH){
          if(ele === netAssetApproachMethods){
            this.netAssetApproachmodels.push(ele);
          }
        }
        for(const marketApproachMethods of MARKET_APPROACH){
          if(ele === marketApproachMethods){
            this.marketApproachmodels.push(ele);
          }
        }
      }
      this.models =  this.data?.model
    }
    if(data?.projectionYearSelect){
      this.projectionYearSelect = data?.projectionYearSelect;
    }
    if(data.terminalGrowthRate){
      this.terminalGrowthRateControl.setValue(parseInt(data?.terminalGrowthRate));
    }
    if(data.projectionYears){
      console.log(data?.projectionYears,"projection year")
      this.projectionYears = data.projectionYears;
    }
    if(data?.fileName){
      this.fileName = data?.fileName;
    }
    if(data?.excelSheetId){
      this.excelSheetId = data.excelSheetId;
    }
  }
}

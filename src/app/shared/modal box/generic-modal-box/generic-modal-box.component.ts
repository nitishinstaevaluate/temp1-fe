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
import { FormControl, Validators } from '@angular/forms';
import { DocumentEditorContainerComponent, WordExportService, SfdtExportService, SelectionService, EditorService } from '@syncfusion/ej2-angular-documenteditor';
import { CalculationsService } from '../../service/calculations.service';
import saveAs from 'file-saver';
import { hasError } from '../../enums/errorMethods';

@Component({
  selector: 'app-generic-modal-box',
  templateUrl: './generic-modal-box.component.html',
  styleUrls: ['./generic-modal-box.component.scss'],
  providers:[EditorService, SelectionService, SfdtExportService, WordExportService]
})
export class GenericModalBoxComponent implements OnInit {
  @ViewChild('viewer') viewerRef!: ElementRef;
  @ViewChild('documentEditor') docEdit!: any;

  terminalGrowthRateControl: FormControl = new FormControl('',[Validators.required]); 
  yearOfProjection: FormControl = new FormControl('',[Validators.required]); 
  analystConsensusEstimates: FormControl = new FormControl('');
  liquidityFactor: FormControl = new FormControl('');
  companySize: FormControl = new FormControl('');
  marketPosition: FormControl = new FormControl('');
  competition: FormControl = new FormControl('');

  taxRate: FormControl = new FormControl('');


  registeredValuerName: FormControl = new FormControl('');
  registeredValuerMobileNumber: FormControl = new FormControl('');
  registeredValuerEmailId: FormControl = new FormControl('');
  registeredValuerIbbiId: FormControl = new FormControl('');
  registeredValuerGeneralAddress: FormControl = new FormControl('');
  registeredValuerQualifications: FormControl = new FormControl('');

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
relativeValuationSelectedModel:any='';
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
companyMaxValue:any=0;
editDoc:any='';
fileUploadStatus:boolean=true;
hasError=hasError

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
private snackBar:MatSnackBar,
private calculationService:CalculationsService){
this.loadModel(data);
if(data?.value === this.appValues.PREVIEW_DOC.value){
this.showWebViewer = true;
}
}

ngOnInit() {
}
   ngAfterViewInit() {}

onCreate(){
  if ( this.data.dataBlob ) {
    // let container: DocumentEditorContainer = new DocumentEditorContainer({ enableToolbar: true, height: '590px', showPropertiesPane:false });
    (this.docEdit as DocumentEditorContainerComponent).showPropertiesPane = false;
    (this.docEdit as DocumentEditorContainerComponent ).documentEditor.open(this.data.dataBlob);
  }
}

loadModel(data:any){
  if( data === this.appValues.Normal_Tax_Rate.value) return this.label = this.appValues.Normal_Tax_Rate.name;
  if( data === this.appValues.MAT_Rate.value) return this.label = this.appValues.MAT_Rate.name;
  if( data === this.appValues.ANALYST_CONSENSUS_ESTIMATES.value) return this.label = this.appValues.ANALYST_CONSENSUS_ESTIMATES.name;
  if( data === this.appValues.GOING_CONCERN.value) return this.label = this.appValues.GOING_CONCERN.name;
  if( data?.data?.value === this.appValues.SPECIFIC_RISK_PREMIUM.value) {
    this.patchSpecificRiskPremiumDetails(data.data);
    return this.label = this.appValues.SPECIFIC_RISK_PREMIUM.name
  };
  if( data?.data?.value === this.appValues.REGISTERED_VALUER_DETAILS.value) {
    this.patchValuerDetails(data.data);
    return this.label = this.appValues.REGISTERED_VALUER_DETAILS.name;
  }
  if( data === this.appValues.TARGET_CAPITAL_STRUCTURE.value) return this.label = this.appValues.TARGET_CAPITAL_STRUCTURE.name;
  if( data?.value === this.appValues.PREVIEW_DOC.value) return this.label = this.appValues.PREVIEW_DOC.name;
  if( data?.value === this.appValues.VALUATION_METHOD.value) {
    this.patchExistingValue(data);
    return this.label = this.appValues.VALUATION_METHOD.name;
  }
  return '';
}

async onSave(){
  // (this.docEdit as DocumentEditorContainerComponent).documentEditor.save('sample', 'Docx');
  const docBlob = await (this.docEdit as DocumentEditorContainerComponent).documentEditor.saveAsBlob('Docx')
  const payload = {
    docxBuffer: docBlob,
    reportId: this.data.reportId
  };

  await this.convertDocxToPdf(payload);
}

async convertDocxToPdf(payload:any){
  const formData = new FormData();
formData.append('file', payload.docxBuffer, `Ifinworth Valuation-${payload.reportId}.docx`);
  this.calculationService.updateReportDocxBuffer(payload.reportId,formData).subscribe((response:any)=>{
    if(response){
      console.log("updated success")
      this.snackBar.open('Doc Update Success','ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
    }
    else{
      this.snackBar.open('Doc Update Failed','ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-success'
      })
      
    }
  })
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
        const modelInput = {
          model:[...this.incomeApproachmodels]
        }
        this.patchExistingValue(modelInput,true)
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
  if(this.incomeApproachmodels.length === 0 && this.netAssetApproachmodels.length === 0 && this.marketApproachmodels.length === 0){
    this.snackBar.open('Please select valuation models','Ok',{
      horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error'
    })
    return;
  }
  if(this.fcfeSelectedModel || this.fcffSelectedModel || this.excessEarningSelectedModel){
    if(this.projectionYearSelect === 'Going_Concern'){

      if(this.yearOfProjection.invalid || this.terminalGrowthRateControl.invalid){
        this.yearOfProjection.markAsTouched();
        this.terminalGrowthRateControl.markAsTouched();
        this.snackBar.open('Please fill the required fields','Ok',{
          horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
              panelClass: 'app-notification-error'
        })
        return;
      }
    }
    if(!this.projectionYearSelect){
        this.snackBar.open('Please Select the projections','Ok',{
          horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
              panelClass: 'app-notification-error'
        })
        return;
    }
  }

  if(!this.excelSheetId){
    this.fileUploadStatus = false;
    this.snackBar.open('Please upload excel sheet','Ok',{
      horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error'
    })
    return;
  }
  

    this.models=[...this.incomeApproachmodels,...this.netAssetApproachmodels,...this.marketApproachmodels];
  
    this.dialogRef.close({
      model:this.models,
      projectionYearSelect:this.projectionYearSelect ?? '',
      terminalGrowthRate:this.terminalGrowthRateControl.value ?? '',
      projectionYears:this.yearOfProjection.value ?? '',
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

    case 'Relative_Valuation':
      this.relativeValuationSelectedModel = null;
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
    this.valuationService.fileUpload(formData).subscribe((res: any) => {
      this.excelSheetId = res.excelSheetId;
      this.fileUploadStatus = true;
      if(res.excelSheetId){
        this.snackBar.open('File has been uploaded successfully','Ok',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      }
      
      event.target.value = '';
    });
  }

  patchExistingValue(data:any,validator?:boolean){
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
          case 'Relative_Valuation':
            this.relativeValuationSelectedModel = true;
            break;
          case 'Market_Price':
            this.marketPriceSelectedModel = true;
            break;
        }

       if(!validator){
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
      this.yearOfProjection.setValue(data.projectionYears);
    }
    if(data?.fileName){
      this.fileName = data?.fileName;
    }
    if(data?.excelSheetId){
      this.excelSheetId = data.excelSheetId;
    }
  }

  patchValuerDetails(data:any){
    if(data?.registeredValuerName){
      this.registeredValuerName.setValue(data.registeredValuerName);
    }
    if(data?.registeredValuerMobileNumber){
      this.registeredValuerMobileNumber.setValue(data.registeredValuerMobileNumber);
    }
    if(data?.registeredValuerEmailId){
      this.registeredValuerEmailId.setValue(data.registeredValuerEmailId);
    }
    if(data?.registeredValuerIbbiId){
      this.registeredValuerIbbiId.setValue(data.registeredValuerIbbiId);
    }
    if(data?.registeredValuerGeneralAddress){
      this.registeredValuerGeneralAddress.setValue(data.registeredValuerGeneralAddress);
    }
    if(data?.registeredValuerQualifications){
      this.registeredValuerQualifications.setValue(data.registeredValuerQualifications);
    }

  }
  patchSpecificRiskPremiumDetails(data:any){
    if(data?.liquidityFactor){
      this.liquidityFactor.setValue(data.liquidityFactor);
    }
    if(data?.companySize){
      this.companySize.setValue(data.companySize);
    }
    if(data?.marketPosition){
      this.marketPosition.setValue(data.marketPosition);
    }
    if(data?.competition){
      this.competition.setValue(data.competition);
    }
  }
}

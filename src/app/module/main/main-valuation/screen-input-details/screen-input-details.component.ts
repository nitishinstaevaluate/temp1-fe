import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { INDUSTRY_BASED_COMPANY, MODELS } from 'src/app/shared/enums/constant';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime, distinctUntilChanged, switchMap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-screen-input-details',
  templateUrl: './screen-input-details.component.html',
  styleUrls: ['./screen-input-details.component.scss']
})
export class ScreenInputDetailsComponent implements OnInit,OnChanges {
  @Input() step:any;
  @Output() screenInputDetails:any = new EventEmitter<any>();
  @Output() previousPage:any = new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() secondStageInput:any;
  inputScreenForm:any;
  hasError=hasError;
  modelControl=groupModelControl;
  ciqIndustryData:any;
  ciqIndustryHead=['Company Id', 'Company Name', 'City', 'Industry Description'];
  mapIndustryBasedCompany:any = INDUSTRY_BASED_COMPANY;
  loader=false;
  levelThreeIndustry:any=[];
  levelFourIndustry:any=[];
  industryFourDropdownValue:boolean = false;
  companyStatusDropdownValue:boolean = false;
  companyTypeDropdownValue:boolean = false;
  industryFourDropdownFocused:boolean = false;
  companyStatusDropdownFocused:boolean = false;
  companyTypeDropdownFocused:boolean = false;
  companyStatusType:any= [];
  companyType:any= [];
  levelFourIndustryDescription:any = [];
  companyStatusTypeDescription:any = [];
  companyTypeDescription:any = [];
  levelThreeIndustryDescription:any='';
  selectedObjects: any = [];
  selectedLevelFourIndustry: any = [];
  selectedCompanyType: any = [];
  selectedCompanyStatusType: any = [];
  descriptorQuery: any = '';
  searchByDescriptor = new Subject<string>(); 
  mainIndustries:any = [];
  total=0;
  constructor(
    private fb:FormBuilder,
    private ciqSpService:CiqSPService,
    private calculationService:CalculationsService,
    private processStatusManagerService: ProcessStatusManagerService,
    private snackBar: MatSnackBar){}

  ngOnInit(){
    this.loadForm();
    this.loadEnums();
    this.checkProcessExist(this.secondStageInput);
    this.onValueChange();
    // this.searchByBusinessDescriptor();
    this.searchByDescriptor.pipe(
      debounceTime(1300),
      throttleTime(1000),
      distinctUntilChanged(),
      switchMap(async () => this.loadCiqIndustryBasedLevelFour(this.createPayload()))
    ).subscribe();
  }
   ngOnChanges() {
    this.loadForm();
    // this.checkProcessExist(this.formOneData);
    this.onValueChange();
  }

  loadForm(){
    this.inputScreenForm = this.fb.group({
      companyStatus:[[], [Validators.required]],
      companyType:[[], [Validators.required]],
      descriptor:['', [Validators.required]],
      industryL3:['', [Validators.required]],
      industryL4:[[], [Validators.required]],
    });
  }

  loadEnums(){
    this.loadCiqIndustryList();
    this.loadCiqCompanyStatusType();
    this.loadCiqCompanyType();
  }

  checkProcessExist(data:any){
    // const formOneData = data?.industry ? data?.industry :  data?.formOneData?.industry;

    // if(formOneData){ 
    //  this.inputScreenForm.controls['industryL3'].setValue(formOneData);
    //   if(this.inputScreenForm.controls['industryL3'].value){
    //     this.levelThreeIndustryDescription = this.inputScreenForm.controls['industryL3'].value;
    //     this.loadCiqDescriptorBasedIndustry(this.inputScreenForm.controls['industryL3'].value);
    //   }
    //  }

     const formTwoData = data?.formTwoData;
     if(formTwoData){
      if(formTwoData?.industryL3){
        // this.inputScreenForm.controls['industryL3'].setValue(formTwoData.industryL3);
        this.levelThreeIndustryDescription = formTwoData?.industryL3;
        this.loadCiqDescriptorBasedIndustry(formTwoData?.industryL3);
      }

      if(formTwoData?.industryL4){
        this.selectedLevelFourIndustry = formTwoData.industryL4.map((elements:any)=>{
          this.levelFourIndustryDescription.push(elements.GICSDescriptor);
          return {
            GICSDescriptor:elements.GICSDescriptor
          }
        })
      }

      if(formTwoData?.companyType){
        this.selectedCompanyType = formTwoData.companyType.map((elements:any)=>{
          this.companyTypeDescription.push(elements.companytypename);
          return {
            companytypename:elements.companytypename
          }
        })
        if(formTwoData?.companyType.length){
          this.companyTypeDropdownValue = true;
        }
      }

      if(formTwoData?.companyStatus){
        this.selectedCompanyStatusType = formTwoData.companyStatus.map((elements:any)=>{
          this.companyStatusTypeDescription.push(elements.companystatustypename)
          return {
            companystatustypename:elements.companystatustypename
          }
        })
        if(formTwoData?.companyStatus.length){
          this.companyStatusDropdownValue = true;
        }
      }

      if(formTwoData?.descriptor && this.inputScreenForm){
        this.descriptorQuery = formTwoData.descriptor;
        this.inputScreenForm.get('descriptor').setValue(this.descriptorQuery);
      }
     }

      this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.GICSDescriptor === o2.GICSDescriptor : o2 === o2;
  }

  onValueChange(){
    this.inputScreenForm.controls['industryL3'].valueChanges.subscribe((val:any) => {
      if (!val) {
        return;
      }
      this.loadCiqDescriptorBasedIndustry(val);

      this.levelThreeIndustryDescription = val;
      this.loadCiqIndustryBasedLevelFour(this.createPayload());
    });
    if(this.descriptorQuery){
      this.inputScreenForm.get('descriptor').setValue(this.descriptorQuery);
    }
    if(this.levelThreeIndustryDescription){
      this.inputScreenForm.controls['industryL3'].setValue(this.levelThreeIndustryDescription);
    }
    if(this.selectedLevelFourIndustry.length){
      this.industryFourDropdownValue = true;
    }
    if(this.formOneData?.location != this.secondStageInput?.formOneData?.location){
      this.loadCiqIndustryBasedLevelFour(this.createPayload());
    }
  }

  saveAndNext(){
    localStorage.setItem('stepTwoStats',`true`)
    this.screenInputDetails.emit({formFillingStatus:true});
    this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step})
    const processStateModel ={
      secondStageInput:{formFillingStatus:true,...this.inputScreenForm.value},
      step:2
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))
  }

  previous(){
    this.previousPage.emit(true)
  }

  loadCiqIndustry(industry:any,location:any){
    this.loader = true;
    this.ciqSpService.getSPCompanyBasedIndustry(industry,location).subscribe((ciqIndustry:any)=>{
      if(ciqIndustry.status){
        this.loader = false;
        this.ciqIndustryData = ciqIndustry?.data;
      }
      else{
        this.loader = false;
        this.snackBar.open(`industry not found`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        },);
      }
    },(error)=>{
      this.loader = false;
      this.snackBar.open(`${error}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      },); 
    })
  }

  processStateManager(process:any, processId:any){
    this.processStatusManagerService.instantiateProcess(process, processId).subscribe(
      (processStatusDetails: any) => {
        if (processStatusDetails.status) {
          localStorage.setItem('processStateId', processStatusDetails.processId);
        }
      },
      (error) => {
        this.snackBar.open(`${error.message}`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        });
      }
    );
  }

  isIndustryId(row:any){
    if(row === INDUSTRY_BASED_COMPANY[2]){
      return true;
    }
    return false;
  }

  loadCiqIndustryList(){
    this.ciqSpService.fetchSPHierarchyBasedIndustry().subscribe((industryList:any)=>{
      if(industryList.status){
        this.levelThreeIndustry = industryList.data;
      }
      else{
       this.snackBar.open('CIQ Industry list not found','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },
    (error)=>{
      this.snackBar.open(`${error}`,'OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
    })
  }

  loadCiqDescriptorBasedIndustry(descriptor:any){
    this.levelFourIndustryDescription = [];
    this.industryFourDropdownValue = false;
    this.industryFourDropdownFocused = false;
    if(!this.levelFourIndustry.length){
      this.ciqSpService.getSPLevelFourIndustryBasedList(descriptor).subscribe((levelFourIndustryData:any)=>{
        if(levelFourIndustryData.status){
          this.levelFourIndustry = levelFourIndustryData.data
        }
        else{
          this.snackBar.open('CIQ Industry (Level-4) list not found','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error'
          })
        }
      },
      (error)=>{
        this.snackBar.open(`${error}`,'OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      })
    }
  }

  loadCiqIndustryBasedLevelFour(payload:any){
    this.loader = true;
    this.ciqSpService.getSPIndustryListByLevelFourIndustries(payload).subscribe((industryData:any)=>{
      if(industryData.status){
        this.loader = false;
        this.ciqIndustryData = industryData.data;
        this.total = industryData.total
      }
      else{
        this.loader = false;
        this.snackBar.open('CIQ Industry (Level-4) list not found','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },
    (error)=>{
      this.loader = false;
      this.snackBar.open(`${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  loadCiqCompanyStatusType(){
    this.ciqSpService.getSPCompanyStatusType().subscribe((companyStatusTypeData:any)=>{
      if(companyStatusTypeData.status){
        this.companyStatusType = companyStatusTypeData.data;
      }
      else{
        this.snackBar.open('CIQ Company Status type fetch failed','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.snackBar.open(`${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  loadCiqCompanyType(){
    this.ciqSpService.getSPCompanyType().subscribe((companyTypeData:any)=>{
      if(companyTypeData.status){
        this.companyType = companyTypeData.data;
      }
      else{
        this.snackBar.open('CIQ Company type fetch failed','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.snackBar.open(`${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  onDropdownFocus(event: any, desc: string) {
    if(desc === 'industryFour'){
      this.industryFourDropdownFocused = event;
    }
    if(desc === 'companyStatus'){
      this.companyStatusDropdownFocused = event;
    }

    if(desc === 'companyType'){
      this.companyTypeDropdownFocused = event;
    }
  }

  onDropdownChange(event: any, desc: string) {
    if(desc === 'industryFour' && event?.value){
      this.handleLevelFourIndustry(event);
    }

    if(desc === 'companyStatus' && event?.value){
      this.handleCompanyStatusType(event);
    }

    if(desc === 'companyType' && event?.value){
      this.handleCompanyType(event);
    }
  }

  handleCompanyType(event:any){
    if(event.value?.length){
      this.companyTypeDropdownValue = true;
      const createCompanyType = event.value.map((elements: any)=>{
        return elements.companytypename
      })
      this.companyTypeDescription = createCompanyType;
    }
    else{
      this.companyTypeDropdownValue = false;
      this.companyTypeDescription = [];
    }
      
    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  handleCompanyStatusType(event:any){
    if(event.value.length){
      this.companyStatusDropdownValue = true;
      const createCompanyStatusType = event.value.map((elements: any)=>{
        return elements.companystatustypename
      })
      this.companyStatusTypeDescription = createCompanyStatusType;
    }
    else{
      this.companyStatusDropdownValue = false
      this.companyStatusTypeDescription = [];
    }
   
    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  handleLevelFourIndustry(event:any){
    if(event?.value.length){
      this.industryFourDropdownValue = true;
      const createLevelFourIndustry = event.value.map((elements: any)=>{
        return elements.GICSDescriptor
      })
      this.levelFourIndustryDescription = createLevelFourIndustry;
    }
    else{
      this.industryFourDropdownValue = false;
      this.levelFourIndustryDescription = [];
    }

    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  filterByBusinessDescriptor(event:any){
    if(this.descriptorQuery !== event.target.value){
      this.descriptorQuery = event.target.value;
      this.searchByDescriptor.next(this.descriptorQuery);
    }
  }

  // searchByBusinessDescriptor(){
  //   console.log("api triggered")
    
  // }

  createPayload() {
    return {
      levelFourIndustries: this.levelFourIndustryDescription,
      companyStatusType: this.companyStatusTypeDescription,
      companyType: this.companyTypeDescription,
      industryName: this.levelThreeIndustryDescription,
      businessDescriptor: this.descriptorQuery,
      location: this.formOneData?.location || this.secondStageInput?.formOneData?.location,
      processStateId:localStorage.getItem('processStateId')
    };
  }

 async onIndustryCheck(data:any){
    if(!data)
      return;
    // await this.createIndustryStructure(data);
  }

  // async createIndustryStructure(data:any){
  //   console.log(data,"data")
  //   let newIndustryList = [];
  //   const checkIfIndustryExist = this.mainIndustries;
  //   // if(!checkIfIndustryExist.length){
  //   //   newIndustryList.push(data)
  //   //   return 
  //   // }
  //   for await(const industryData of checkIfIndustryExist){
  //     // checkIfIndustryExist.map((industryData:any)=>{
  //       if(industryData?.COMPANYID !== data.COMPANYID){
  //         newIndustryList.push(data)
  //       }else{
  //         console.log("inside else")
  //       }
  //       // console.log(this.mainIndustries,"added")
  //     // })
  //   }
  //   console.log([...this.mainIndustries,...newIndustryList],"all on select ind")
  // }

  onCheckboxChange(event:any){
    if(event.target.checked){
      this.inputScreenForm.controls['industryL3'].setValue('');
      this.levelThreeIndustryDescription = '';
      this.loadCiqIndustryBasedLevelFour(this.createPayload())
    }
  }
}

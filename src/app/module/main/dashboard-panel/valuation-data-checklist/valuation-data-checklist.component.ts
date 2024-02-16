import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GET_TEMPLATE } from 'src/app/shared/enums/functions';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-valuation-data-checklist',
  templateUrl: './valuation-data-checklist.component.html',
  styleUrls: ['./valuation-data-checklist.component.scss']
})
export class ValuationDataChecklistComponent {
  files:any=[];
  excelSheetId:any;
  fileName:any;
  constructor(private valuationService:ValuationService,
  private snackBar:MatSnackBar){}

  submiDataCheckListForm(){}

    get downloadTemplate() {
     return GET_TEMPLATE('1', 'default');
    }
  
    onFileSelected(event: any) {
      if (event && event.target.files && event.target.files.length > 0) {
        this.files = event.target.files;
        this.fileName = this.files[0].name;
      }
    
      if (this.files.length === 0) {
        return;
      }
    
      const formData = new FormData();
      formData.append('file', this.files[0]);
      this.valuationService.fileUpload(formData).subscribe((res: any) => {
        this.excelSheetId = res.excelSheetId;
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
}

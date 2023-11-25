import { FormGroup } from "@angular/forms";

export function hasError( controlName: any, errorName: string,formGroup?:FormGroup): boolean {
  if(formGroup){
    const control = formGroup.get(controlName);
    return control ? control.hasError(errorName) : false;
  }
  else{
    return controlName ? controlName.hasError(errorName) : false;
  }
  }
  
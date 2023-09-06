import { FormGroup } from "@angular/forms";

export function hasError(formGroup:FormGroup, controlName: any, errorName: string): boolean {
    const control = formGroup.get(controlName);
    return control ? control.hasError(errorName) : false;
  }
  
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ComponentInteractionService } from './component-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class FieldValidationService {

  constructor(private componentInteractiveService: ComponentInteractionService, private http:HttpClient) { }

  HOST = environment.baseUrl;


  upsertFieldValidation(payload:any){
    return this.http.post(`${this.HOST}field-validation/upsert`, payload);
  }

  async upsertValidator(payload: any) {
    try {
        const response = await this.upsertFieldValidation(payload).toPromise();
        this.componentInteractiveService.broadCastFieldValidators(response);
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  }
}

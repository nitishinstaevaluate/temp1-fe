import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
const HOST = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SensitivityAnalysisService {

  constructor(private http: HttpClient) {}
  SArerunDetector = new Subject<{ status: boolean }>();

  fetchSAbyId(sensitivityAnalysisId:any){
    return this.http.get(`${HOST}sensitivity-analysis/get-by-id/${sensitivityAnalysisId}`)
  }
  
  SAsecondaryRevaluation(payload:any){
    return this.http.post(`${HOST}sensitivity-analysis/sa-secondary-revaluation`, payload)
  }

  updateSelectedValuationId(payload:any){
    return this.http.post(`${HOST}sensitivity-analysis/update-selected-valuation-id`, payload)
  }

  deleteSAsecondaryRevaluation(payload:any){
    return this.http.post(`${HOST}sensitivity-analysis/delete-sa-secondary-revaluation`, payload)
  }
}

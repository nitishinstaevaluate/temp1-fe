import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../service/util.service';
import { CHECKLIST_TYPES } from '../enums/constant';

@Injectable({
  providedIn: 'root'
})
export class ChecklistIdGuard implements CanActivate {
  constructor(private router: Router, private utilService:UtilService) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const rawLinkId = route.paramMap.get('linkId');
  
    try {

      const linkResponse:any = await this.mapStateUrl(state.url, rawLinkId);
      
      if (linkResponse.status) {
        const isValid = linkResponse.linkValid;
        
        if (!isValid) {
          this.router.navigate(['dashboard/panel']);
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error occurred while validating link ID:', error);
      return false;
    }
  }

  async mapStateUrl(url:any, rawLinkId:any){
    try{
      switch(true){
        case url.includes('mandate'):
          return await this.utilService.validateLinkId(rawLinkId, CHECKLIST_TYPES.mandateChecklist).toPromise();

        case url.includes('data-checklist'):
          return await this.utilService.validateLinkId(rawLinkId, CHECKLIST_TYPES.dataCheckList).toPromise();

        default:
          return false;
      }
    }
    catch(error){
      console.error('Error occurred while mapping routes:', error);
      return false;
    }
  }
}

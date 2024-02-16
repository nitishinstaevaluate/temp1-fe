import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../service/util.service';

@Injectable({
  providedIn: 'root'
})
export class DataChecklistIdGuard implements CanActivate {
  constructor(private router: Router, private utilService:UtilService) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const rawLinkId = route.paramMap.get('linkId');
  
    try {
      const linkResponse: any = await this.utilService.validateLinkId(rawLinkId).toPromise();
      
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

  
}

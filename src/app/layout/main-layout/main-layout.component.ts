import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

  isLoggedIn(){
    const access_token = sessionStorage.getItem('access_token');
    if(!access_token)
      return false;
    return true;
  }
}

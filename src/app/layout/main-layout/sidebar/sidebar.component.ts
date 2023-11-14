import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from 'src/app/shared/service/nav.service';

interface MENU{
  title:string;
  link:string;
  icon:string;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  constructor(
    private navServices: NavService,
    private route:Router
  ){

  }
  selectedMenuItem: string = '/dashboard';
menues :MENU[] =[
  // {
  //   title: "Valuation",
  //   link : "/dashboard",
  //   icon:'fa fa-usd mx-2',
  // },
  
  {
    title: "Valuation",
    link : "/dashboard",
    icon:"fa fa-usd mx-2",
  },
  {
    title: "Activity",
    link : "/dashboard/activity",
    icon:"fa fa-clock-o",
  }
];
sidebarClose(){
  if ((this.navServices.collapseSidebar = true)) {
    document.querySelector('.app')?.classList.remove('sidenav-toggled');
    this.navServices.collapseSidebar = false;
  }
}

selectMenuItem(route: string): void {
  this.selectedMenuItem = route;
  this.route.navigate([`${route}`])
}
}

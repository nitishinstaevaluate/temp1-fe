import { Component } from '@angular/core';
import { NavService } from 'src/app/shared/service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  



  constructor(
    private navServices: NavService,
  ){

  }
menues :any[] =[
  {
    title: "Valution",
    link : "/dashboard",
    icon:'fa fa-usd mx-2',
  },
  // {
  //   title: "Activity",
  //   link : "/dashboard/activity"
  // }
];
sidebarClose(){
  if ((this.navServices.collapseSidebar = true)) {
    document.querySelector('.app')?.classList.remove('sidenav-toggled');
    this.navServices.collapseSidebar = false;
  }
}
}

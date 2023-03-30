import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
menues :any[] =[
  {
    title: "valution",
    link : "/dashboard"
  },
  {
    title: "activity",
    link : "/dashboard/activity"
  }
];
}

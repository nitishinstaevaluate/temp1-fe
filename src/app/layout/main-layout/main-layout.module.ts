import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
// import { NewMainLayoutComponent } from './new-main-layout/new-main-layout.component';
// import { NewHeaderComponent } from './new-header/new-header.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    // NewMainLayoutComponent,
    // NewHeaderComponent,
  ],
  imports: [
    CommonModule,
    MainLayoutRoutingModule,
    SharedModule
  ]
})
export class MainLayoutModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from './material-module.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleThemeDirective } from './directive/toggle-theme.directive';
import { FullscreenDirective } from './directive/fullsScreen-toggle.directive';
import { SidemenuToggleDirective } from './directive/sidemenuToggle';
import { UserInputComponent } from './Modal/user-input.component';
import { RelativeComponent } from './Modal/relative/relative.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { GenericModalBoxComponent } from './modal box/generic-modal-box/generic-modal-box.component';
import { CustomDatePipe } from './pipe/date.pipe';




const MODULES = [NgbModule, ReactiveFormsModule, FormsModule,MaterialModuleModule,NgSelectModule];

@NgModule({
  declarations: [ToggleThemeDirective, FullscreenDirective, SidemenuToggleDirective,UserInputComponent,RelativeComponent,GenericModalBoxComponent],
  imports: [CommonModule,NgxSliderModule,...MODULES],
  exports: [RelativeComponent,UserInputComponent,...MODULES,GenericModalBoxComponent],
  entryComponents:[GenericModalBoxComponent],
  providers:[CustomDatePipe]
})
export class SharedModule {}

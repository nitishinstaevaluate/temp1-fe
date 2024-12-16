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
import { QuillModule } from 'ngx-quill';
import { StringModificationPipe } from './pipe/string-modification.pipe';
import { DocumentEditorModule, DocumentEditorContainerModule,ToolbarService, } from '@syncfusion/ej2-angular-documenteditor';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, ChipListModule, FabModule, SpeedDialModule } from '@syncfusion/ej2-angular-buttons';
import { NgxUiLoaderComponent } from './ngx-loader/ngx-ui-loader/ngx-ui-loader.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedComponentsModule } from './shared-component.module';
import { QRCodeModule } from 'angularx-qrcode';


const MODULES = [NgbModule, ReactiveFormsModule, FormsModule,MaterialModuleModule,NgSelectModule,NgxUiLoaderModule,QRCodeModule];

@NgModule({
  declarations: [ToggleThemeDirective, FullscreenDirective, SidemenuToggleDirective,UserInputComponent,RelativeComponent,GenericModalBoxComponent,NgxUiLoaderComponent],
  imports: [CommonModule,NgxSliderModule,...MODULES,QuillModule.forRoot(),DocumentEditorModule,DocumentEditorContainerModule, ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, ChipListModule, FabModule, SpeedDialModule, SharedComponentsModule],
  exports: [RelativeComponent,UserInputComponent,...MODULES,GenericModalBoxComponent,NgxUiLoaderComponent],
  entryComponents:[GenericModalBoxComponent,NgxUiLoaderComponent],
  providers:[CustomDatePipe,StringModificationPipe,ToolbarService]
})
export class SharedModule {}

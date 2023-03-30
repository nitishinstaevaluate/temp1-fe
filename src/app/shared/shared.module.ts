import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from './material-module.module';

const MODULES = [NgbModule, ReactiveFormsModule, FormsModule,MaterialModuleModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, MODULES],
  exports: [MODULES],
})
export class SharedModule {}

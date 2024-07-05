import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from './material-module.module';
import { FcfeDetailsComponent } from '../module/main/main-valuation/models-details/fcfe-details/fcfe-details.component';
import { FcffDetailsComponent } from '../module/main/main-valuation/models-details/fcff-details/fcff-details.component';

@NgModule({
  declarations: [FcfeDetailsComponent, FcffDetailsComponent],
  imports: [CommonModule, FormsModule, MaterialModuleModule, ReactiveFormsModule],
  exports: [FcfeDetailsComponent, FcffDetailsComponent]
})
export class SharedComponentsModule {}

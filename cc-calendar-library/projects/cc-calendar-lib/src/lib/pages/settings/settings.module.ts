import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralSettingsModule } from './general-settings/general-settings.module';
import { AntDesignModule } from '../../ant-design.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { BaseSettingsComponent } from './base-settings/base-settings.component';

@NgModule({
  declarations: [BaseSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    GeneralSettingsModule,
    AntDesignModule,
  ],
  exports: [BaseSettingsComponent],
})
export class SettingsModule {}

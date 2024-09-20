import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../../../ant-design.module';

import { GeneralSettingsRoutingModule } from './general-settings-routing.module';
import { TimezoneSettingsComponent } from './timezone-settings/timezone-settings.component';
import { EventSettingsComponent } from './event-settings/event-settings.component';
import { TaskSettingsComponent } from './task-settings/task-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ViewSettingsComponent } from './view-settings/view-settings.component';
import { ReminderSettingsComponent } from './reminder-settings/reminder-settings.component';

@NgModule({
  declarations: [
    TimezoneSettingsComponent,
    EventSettingsComponent,
    TaskSettingsComponent,
    NotificationSettingsComponent,
    ViewSettingsComponent,
    ReminderSettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralSettingsRoutingModule,
    AntDesignModule,
  ],
  exports: [
    TimezoneSettingsComponent,
    EventSettingsComponent,
    TaskSettingsComponent,
    NotificationSettingsComponent,
    ViewSettingsComponent,
    ReminderSettingsComponent
  ],
})
export class GeneralSettingsModule {}

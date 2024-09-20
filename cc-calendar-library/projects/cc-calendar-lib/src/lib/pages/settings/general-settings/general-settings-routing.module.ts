import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimezoneSettingsComponent } from './timezone-settings/timezone-settings.component';
import { EventSettingsComponent } from './event-settings/event-settings.component';
import { TaskSettingsComponent } from './task-settings/task-settings.component';

const routes: Routes = [
  { path: 'timezone', component: TimezoneSettingsComponent },
  { path: 'event', component: EventSettingsComponent },
  { path: 'task', component: TaskSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralSettingsRoutingModule {}

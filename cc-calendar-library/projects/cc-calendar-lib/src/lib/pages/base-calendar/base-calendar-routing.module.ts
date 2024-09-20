import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseCalendarComponent } from '../base-calendar/base-calendar/base-calendar.component';

const routes: Routes = [{ path: '', component: BaseCalendarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseCalendarRoutingModule {}

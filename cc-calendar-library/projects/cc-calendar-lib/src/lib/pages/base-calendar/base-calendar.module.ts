import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { BaseCalendarRoutingModule } from './base-calendar-routing.module';

import {
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTitleFormatter,
  CalendarModule,
  CalendarModuleConfig,
  CalendarUtils,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
//components
import { BaseCalendarComponent } from '../base-calendar/base-calendar/base-calendar.component';
import { CalenadrSidebarComponent } from './calenadr-sidebar/calenadr-sidebar.component';
import { AntDesignModule } from '../../ant-design.module';
import { CalendarGridComponent } from './calendar-grid/calendar-grid.component';
import { CalendarYearViewComponent } from './calendar-year-view/calendar-year-view.component';

@NgModule({
  declarations: [
    BaseCalendarComponent,
    CalenadrSidebarComponent,
    CalendarGridComponent,
    CalendarYearViewComponent,
  ],
  imports: [
    CommonModule,
    BaseCalendarRoutingModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    AntDesignModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    BaseCalendarComponent,
    CalenadrSidebarComponent,
    CalendarGridComponent,
    CalendarYearViewComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DatePipe,
    {
      provide: CalendarEventTitleFormatter,
    },
  ],
})
export class BaseCalendarModule {}

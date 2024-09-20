import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// modules
import { BaseCalendarModule } from './pages/base-calendar/base-calendar.module';
import { SettingsModule } from './pages/settings/settings.module';

//ant-design
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EventsModule } from './pages/events/events.module';
import { TasksModule } from './pages/tasks/tasks.module';

//Interceptors
import { calendarInterceptor } from './interceptor/calendar.interceptor';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BaseCalendarModule,
    FormsModule,
    EventsModule,
    SettingsModule,
    TasksModule,
  ],
  exports: [
    AppComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([calendarInterceptor])),
  ],
 
  bootstrap: [AppComponent],
})
export class AppModule {}

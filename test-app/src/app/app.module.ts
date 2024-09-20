import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { CcCalendarLibModule } from 'cc-calendar-lib';
import { AntDesignModule, AppModule as CcCalendarLibModule } from 'cc-calendar-lib';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CcCalendarLibModule, AntDesignModule],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

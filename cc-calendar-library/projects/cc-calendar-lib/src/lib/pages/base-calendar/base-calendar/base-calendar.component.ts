import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EventTaskService } from '../../../services/event-task.service';
import { CalenadarService } from '../../../services/calenadar.service';

@Component({
  selector: 'app-base-calendar',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './base-calendar.component.html',
  styleUrl: './base-calendar.component.scss',
})
export class BaseCalendarComponent {
  sidebarCollapsed: boolean = false;

  constructor(
    private eventTaskService: EventTaskService,
    private calendarService: CalenadarService
  ) {}

  ngOnInit(): void {
    console.log('base-calendar component');

    this.toggleSidebarTrigger();
  }

  toggleSidebar() {
    this.calendarService.toggleSidebar();
  }

  toggleSidebarTrigger() {
    this.calendarService.isSidebarCollapsed$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
      console.log('sidebarCollapsed ', this.sidebarCollapsed);
    });
  }
}

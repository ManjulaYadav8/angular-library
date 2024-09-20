import { Component, OnInit } from '@angular/core';
import { EventTaskService } from './services/event-task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private eventTaskService: EventTaskService) {}

  ngOnInit(): void {
    this.getAllEventTypes();
    this.getTaskType();
    this.getAllTaskStatus();
    this.getAllSettingsLookup();
    // this.getAllUserAppliedSettings();
  }
  getAllEventTypes() {
    let lookup_type = 'Event Type';
    this.eventTaskService.getEventTypes(lookup_type).subscribe({
      next: (res: any) => {
        // console.log('Event types received:', res);
        this.eventTaskService.storeDataOnLocalStorage('event-types', res.data);
      },
      error: (error) => {
        console.error('Error fetching event types:', error);
      },
    });
  }
  getTaskType() {
    let lookup_type = 'Task Type';
    this.eventTaskService.getEventTypes(lookup_type).subscribe({
      next: (res: any) => {
        // console.log('task types received:', res);
        this.eventTaskService.storeDataOnLocalStorage('task-types', res.data);
      },
      error: (error) => {
        console.error('Error fetching event types:', error);
      },
    });
  }
  getAllTaskStatus() {
    let lookup_type = 'Task Status';
    this.eventTaskService.getEventTypes(lookup_type).subscribe({
      next: (res: any) => {
        // console.log('task types received:', res);
        this.eventTaskService.storeDataOnLocalStorage('task-status', res.data);
      },
      error: (error) => {
        console.error('Error fetching event types:', error);
      },
    });
  }
  getAllSettingsLookup() {
    let lookup_type = 'Settings';
    this.eventTaskService.getEventTypes(lookup_type).subscribe({
      next: (res: any) => {
        this.eventTaskService.storeDataOnLocalStorage('settings', res.data);
      },
      error: (error) => {
        console.error('Error fetching setting lookup:', error);
      },
    });
  }
  getAllUserAppliedSettings() {
    // let params = { userId: -1 };
    let userId= -1
    this.eventTaskService.getUserSetting(userId).subscribe({
      next: (res: any) => {
        console.log('all-user-settings', res);
        // this.eventTaskService.storeDataOnLocalStorage('settings', res.data);
      },
      error: (error) => {
        console.error('Error fetching user setting :', error);
      },
    });
  }
}

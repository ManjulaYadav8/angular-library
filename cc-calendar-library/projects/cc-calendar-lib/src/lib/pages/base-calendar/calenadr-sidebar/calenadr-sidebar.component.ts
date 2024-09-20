import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import moment from 'moment';

import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateEventComponent } from '../../../pages/events/create-event/create-event.component';
import {
  startOfWeek,
  getISOWeek,
  addDays,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { EventTaskService } from '../../../services/event-task.service';
import { CalenadarService } from '../../../services/calenadar.service';
import { CreateTaskComponent } from '../../tasks/create-task/create-task.component';

@Component({
  selector: 'app-calenadr-sidebar',
  templateUrl: './calenadr-sidebar.component.html',
  styleUrl: './calenadr-sidebar.component.scss',
})
export class CalenadrSidebarComponent implements OnInit {
  isSidebarCollapsed: boolean = false;

  allEventTypes: any[] = [];
  selectedEventIds: string[] = [];

  // tasks = [
  //   { name: 'Weekly Meeting', color: '#ec4899', checked: true }, // Pink
  //   { name: 'Client Onboarding', color: '#f97316', checked: true }, // Orange
  //   { name: 'Employee Training', color: '#22c55e', checked: true }, // Green
  //   { name: 'Marketing Strategy', color: '#60a5fa', checked: true }, // Light Blue
  // ];

  tasks: any[] = [];
  selectedTaskIds: string[] = [];
  isChecked: boolean = false;

  calendars = [
    { name: 'Primary', color: '#ec4899', checked: true }, // Pink
  ];

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  currentDate = new Date();
  currentMonth: string = '';
  currentMonthNumber: string = '';
  currentYear = this.currentDate.getFullYear().toString();
  weeks: number[] = [];

  constructor(
    private modal: NzModalService,
    private eventTaskService: EventTaskService,
    private calendarService: CalenadarService
  ) {}

  ngOnInit() {
    this.updateCalendarHeader();
    this.calculateWeekNumbers();
    this.getTasks();
    this.eventTaskTrigger();

    this.allEventTypes =
      this.eventTaskService.getDataFromLocalStorage('event-types');
  }

  eventTaskTrigger() {
    this.eventTaskService.eventCreated$.subscribe((data: any) => {
      this.getTasks();
    });
  }
  toggleSidebar() {
    this.calendarService.isSidebarCollapsed$.subscribe(
      (isCollapsed) => (this.isSidebarCollapsed = isCollapsed)
    );
    this.calendarService.toggleSidebar();
  }

  onEventClick() {
    const modalRef = this.modal.create({
      nzTitle: 'Create Event',
      nzContent: CreateEventComponent,
      nzFooter: null, // Custom footer handled in the modal component
      nzWidth: '550px', // Adjust the width if needed
    });

    // Optional: Handle the closing of the modal on rejection
    const instance = modalRef.getContentComponent();
    instance.submitEvent.subscribe(() => {
      // Destroy the modal when submit event is triggered
      modalRef.destroy();
    });
  }

  onTaskClick() {
    const modalRef = this.modal.create({
      nzTitle: 'Create Task',
      nzContent: CreateTaskComponent,
      nzFooter: null, // Custom footer handled in the modal component
      nzWidth: '550px', // Adjust the width if needed
    });

    // Optional: Handle the closing of the modal on rejection
    const instance = modalRef.getContentComponent();
    instance.submitEvent.subscribe(() => {
      // Destroy the modal when submit event is triggered
      modalRef.destroy();
    });
  }

  goToPreviousMonth() {
    const date = new Date(this.currentDate);
    date.setMonth(date.getMonth() - 1);
    this.currentDate = date;
    this.onValueChange(this.currentDate); // Manually trigger the change
    this.updateCalendarHeader();
  }

  goToNextMonth() {
    const date = new Date(this.currentDate);
    date.setMonth(date.getMonth() + 1);
    this.currentDate = date;
    this.onValueChange(this.currentDate); // Manually trigger the change
    this.updateCalendarHeader();
  }

  onValueChange(date: Date): void {
    console.log('Selected date: ', date);

    this.calculateWeekNumbers();
  }

  updateCalendarHeader() {
    this.currentMonth = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(this.currentDate);
    this.currentMonthNumber = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
    }).format(this.currentDate);
    this.currentYear = this.currentDate.getFullYear().toString();
  }

  getWeekNumber(date: Date): number {
    return getISOWeek(date);
  }

  calculateWeekNumbers(): void {
    this.weeks = [];
    const startOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const firstDayOfWeek = startOfWeek(startOfMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 6; i++) {
      // assuming max 6 weeks per month
      this.weeks.push(getISOWeek(addDays(firstDayOfWeek, i * 7)));
    }
    console.log(this.weeks);
  }

  getAllEventTypes() {
    let lookup_type = 'Event Type';
    this.eventTaskService.getEventTypes(lookup_type).subscribe({
      next: (res: any) => {
        console.log('Event types received:', res);
        this.allEventTypes = res.data;
      },
      error: (error) => {
        console.error('Error fetching event types:', error);
      },
    });
  }

  isSelected(event_type_id: string): boolean {
    return this.selectedEventIds.includes(event_type_id);
  }
  // Function to toggle selection
  toggleSelection(type: any): void {
    const index = this.selectedEventIds.indexOf(type.lookup_id);
    if (index === -1) {
      this.selectedEventIds.push(type.lookup_id); // Add if not already selected
    } else {
      this.selectedEventIds.splice(index, 1); // Remove if already selected
    }
    console.log(this.selectedEventIds);
    const params = { excludeEventTaskTypeIds: this.selectedEventIds.join(',') };
    this.eventTaskService.notifyEventCreated(params);
  }
  getEventTypeId(eventValue: string) {
    return this.eventTaskService.getEventTypeLookupIdByValue(eventValue);
  }
  getTaskStatusTypeIdTypeId(eventValue: string) {
    return this.eventTaskService.getTaskStatusLookupIdByValue(eventValue);
  }
  getButtonClass(type: any): string {
    const isSelected = !this.selectedEventIds.includes(type.lookup_id);

    if (isSelected) {
      if (type.lookup_id === this.getEventTypeId('Document')) {
        return 'document-event-button';
      } else if (type.lookup_id === this.getEventTypeId('Policy')) {
        return 'policy-event-button';
      } else if (type.lookup_id === this.getEventTypeId('Request Checklist')) {
        return 'request-checklist-event-button';
      } else if (type.lookup_id === this.getEventTypeId('Request Compliance')) {
        return 'request-compliance-event-button';
      } else if (type.lookup_id === this.getEventTypeId('Custom Events')) {
        return 'custom-event-button';
      } else {
        return 'greyed-out-button-class';
      }
    } else {
      return 'greyed-out-button-class';
    }
  }

  getTasks() {
    const overdueTaskId = this.getTaskStatusTypeIdTypeId('Overdue');
    const ongoingTaskId = this.getTaskStatusTypeIdTypeId('Ongoing');
    const rescheduledTaskId = this.getTaskStatusTypeIdTypeId('Rescheduled');

    const includedEventTaskStatusIds = `${overdueTaskId}`;
    let params = {
      isTask: 1,
      getCurrentDayTasks: true,
      includedEventTaskStatusIds: includedEventTaskStatusIds,
    };

    console.log(params);

    this.eventTaskService.getEventsTasksInfo(params).subscribe({
      next: (res: any) => {
        this.tasks = res.data;
        this.tasks = res.data.filter(
          (task:any) => task.event_task_status_type_id !== this.getTaskStatusTypeIdTypeId('Completed')
        );
        console.log('Tasks Recived-->', res);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  getTaskStatusTypeId(taskTypeValue: string) {
    return this.eventTaskService.getTaskStatusLookupIdByValue(taskTypeValue);
  }
  tasksCheckBoxColor(taskStatusTypeId: string): string {
    if (taskStatusTypeId === this.getTaskStatusTypeId('Ongoing')) {
      return 'ongoing-task-checkbox';
    } else if (taskStatusTypeId === this.getTaskStatusTypeId('Overdue')) {
      return 'overdue-task-checkbox';
    } else {
      return '';
    }
  }
  isUserTaskCheckBoxSelected(event_task_instance_id: string): boolean {
    return this.selectedTaskIds.includes(event_task_instance_id);
  }
  taskChecboxSelection(task: any): void {
    const index = this.selectedTaskIds.indexOf(task.event_task_instance_id);
    console.log(index);
    if (index === -1) {
      this.selectedTaskIds.push(task.event_task_instance_id); // Add if not already selected
    } else {
      this.selectedTaskIds.splice(index, 1); // Remove if already selected
    }
    console.log('selectedTaskIds-->', this.selectedTaskIds);
    const params = {
      excludedEventTaskInstanceIds: this.selectedTaskIds.join(','),
    };
    console.log(params);
    this.eventTaskService.notifyEventCreated(params);
  }
}

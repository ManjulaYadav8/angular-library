import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  Injectable,
} from '@angular/core';
import {
  addDays,
  addHours,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
  format,
  subWeeks,
  startOfMonth,
  addWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

import { toZonedTime, format as tzFormat } from 'date-fns-tz';
import {
  CalendarView,
  CalendarEvent,
  CalendarUtils,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  EventColor,
  GetMonthViewArgs,
  MonthView,
  GetWeekViewArgs,
  WeekView,
} from 'calendar-utils';
import { EventTaskService } from '../../../services/event-task.service';
import { CalenadarService } from '../../../services/calenadar.service';
import { NzMessageService } from 'ng-zorro-antd/message';
// import moment from 'moment-timezone';
import { DatePipe } from '@angular/common';

// @Injectable()
// export class MyCalendarUtils extends CalendarUtils {
//   override getMonthView(args: GetMonthViewArgs): MonthView {
//     args.viewStart = subWeeks(startOfMonth(args.viewDate), 1);
//     args.viewEnd = addWeeks(endOfMonth(args.viewDate), 1);
//     return super.getMonthView(args);
//   }
// }

interface CustomCalendarEvent extends CalendarEvent {
  eventTaskId: string;
  start: Date;
  title: string;
  eventType: string;
  eventTaskStatusTypeId: string;
  isTask: boolean;
  isHighPriority: boolean;
  isAllDayEvent: boolean;
  description?: string;
  subject?: string;
  eventReminderDetails?: {
    reminderInterval: number;
    reminderUOM: string;
  }[];
  color?: {
    primary: string;
    secondary: string;
  };
  cssClass?: string;
  eventTypeId?: any;
  eventTaskInstanceId?: any;
}

@Component({
  selector: 'app-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss',

  //  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGridComponent {
  sidebarCollapsed: boolean = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  currentView: string = 'Month';

  allEventTypes: any = [];
  events: CustomCalendarEvent[] = [];
  allEventsIntheDay: CustomCalendarEvent[] = [];
  locale: string = 'en-US';

  // events: CustomCalendarEvent[] = [
  //   {
  //     start: new Date('2024-08-12'),
  //     title: 'Weekly Meeting',
  //     eventType: 'custom',
  //     description: 'description 1',
  //     subject: 'subject 1',
  //     eventReminderDetails: [
  //       {
  //         reminderInterval: 10,
  //         reminderUOM: 'minute',
  //       },
  //     ],
  //     color: {
  //       primary: '',
  //       secondary: '',
  //     },

  //     cssClass: 'custom-event-type',
  //   },
  //   {
  //     start: new Date('2024-08-03'),

  //     eventType: 'custom',
  //     title: 'Weekly Meeting',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date('2024-08-19'),

  //     eventType: 'custom',
  //     title: 'Weekly Meeting',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date('2024-08-19'),

  //     eventType: 'document',
  //     title: 'Birthday of Rabindran...',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date('2024-08-24'),

  //     eventType: 'custom',
  //     title: 'Weekly Meeting',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date(),

  //     eventType: 'custom',
  //     title: 'Weekly Meeting',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date(),

  //     eventType: 'document',
  //     title: 'Birthday of Rabindran...',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date(),

  //     eventType: 'policy',
  //     title: 'GMP Certification',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  //   {
  //     start: new Date('2024-08-30'),

  //     eventType: 'policy',
  //     title: 'GMP Certification',
  //     color: { primary: '', secondary: '' },
  //     cssClass: 'document-event-type',
  //   },
  // ];

  // To view each event popup variables set
  showEventPopup: boolean = false;
  isVisibleHiddenEvents: boolean = false;
  selectedEvent!: CustomCalendarEvent;
  refresh = new Subject<void>();
  popupStyle = {};
  activeDayIsOpen: boolean = true;

  primaryTimezone: string = 'America/New_York'; // GMT-05
  secondaryTimezone: string = 'Asia/Kolkata'; // GMT+05:30
  view1: any;
  excludeEventTaskStatusIds: any;

  constructor(
    private eventTaskService: EventTaskService,
    private calendarService: CalenadarService,
    private modal: NgbModal,
    private renderer: Renderer2,
    private toaster: NzMessageService,
    private calendarUtils: CalendarUtils,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log('base-calendar component');

    const completedTaskId = this.getTaskStausTypeId('Completed');
    const overdueTaskId = this.getTaskStausTypeId('Suspended');

    this.excludeEventTaskStatusIds = {
      excludeEventTaskStatusIds: `${completedTaskId},${overdueTaskId}`,
    };

    this.getAllEvents(this.excludeEventTaskStatusIds);
    this.allEventTypes =
      this.eventTaskService.getDataFromLocalStorage('event-types');

    console.log(this.allEventTypes);

    this.toggleSidebarTrigger();
    this.eventTrigger();
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

  eventTrigger() {
    this.eventTaskService.eventCreated$.subscribe((data: any) => {
      this.hidePopups();
      console.log(data);
      let params;
      if (data) {
        params = data;
      }
      params = {
        ...this.excludeEventTaskStatusIds,
        ...params,
      };

      this.getAllEvents(params);
    });
  }

  mapApiResponseToCalendarEvents(apiResponse: any[]): CustomCalendarEvent[] {
    return apiResponse.map((event) => ({
      eventTaskId: event.event_task_id,
      eventTaskInstanceId: event.event_task_instance_id,
      eventTypeId: event.event_task_type_id,
      eventTaskStatusTypeId: event.event_task_status_type_id,
      isTask: event.is_task,
      isHighPriority: event.is_high_priority,
      isAllDayEvent: event.is_all_day_event,
      start: this.parseDate(event.start_dtm),
      end: this.parseDate(event.end_dtm),
      title: event.event_task_title,
      eventType: event.event_task_value,
      description: event.event_task_description,
      subject: event.event_task_subject,
      eventReminderDetails: event.event_task_reminder?.map((reminder: any) => ({
        reminderInterval: reminder.reminderInterval,
        reminderUOM: reminder.reminderUOM,
      })),
      color: {
        primary: '', // Add logic to determine the color based on event type or other criteria
        secondary: '',
      },
      cssClass: !event.is_task
        ? this.determineCssClass(event.event_task_type_id)
        : this.determineTaskCssClass(event.event_task_status_type_id), // Function to determine the CSS class based on event type
    }));
  }
  parseDate(dateString: string): Date {
    // const [day, month, yearAndTime] = dateString.split('/');
    // const [year, time] = yearAndTime.split(' ');
    // const parsedDateString = `${year}-${month}-${day} ${time}`;
    return new Date(dateString);

    // return new Date(dateString);
  }

  getEventTypeId(eventValue: string) {
    return this.eventTaskService.getEventTypeLookupIdByValue(eventValue);
  }

  determineCssClass(eventTaskTypeId: string): string {
    // logic for determining CSS class based on event type ID

    if (eventTaskTypeId === this.getEventTypeId('Custom Events')) {
      return 'custom-event-type';
    } else if (eventTaskTypeId === this.getEventTypeId('Document')) {
      console.log(eventTaskTypeId);
      return 'document-event-type';
    } else if (eventTaskTypeId === this.getEventTypeId('Policy')) {
      return 'policy-event-type';
    } else if (eventTaskTypeId === this.getEventTypeId('Request Checklist')) {
      return 'request-checklist-event-type';
    } else if (eventTaskTypeId === this.getEventTypeId('Request Compliance')) {
      return 'request-complaince-event-type';
    }
    return '';
  }
  getTaskStausTypeId(taskStatusValue: string) {
    return this.eventTaskService.getTaskStatusLookupIdByValue(taskStatusValue);
  }
  getTaskstatusTypeValue(taskStatusId: string) {
    return this.eventTaskService.getTaskStatusLookupValueById(taskStatusId);
  }
  determineTaskCssClass(eventTaskTypeId: string): string {
    if (eventTaskTypeId === this.getTaskStausTypeId('Ongoing')) {
      return 'ongoing-task-status';
    } else if (eventTaskTypeId === this.getTaskStausTypeId('Overdue')) {
      console.log(eventTaskTypeId);
      return 'overdue-task-status';
    }
    return '';
  }

  getAllEvents(params?: any) {
    this.eventTaskService.getEventsTasksInfo(params).subscribe((res: any) => {
      console.log('getAllEventsTasks-->', res);
      this.events = this.mapApiResponseToCalendarEvents(res.data);

      console.log(this.events);
    });
  }

  setView(view: CalendarView) {
    this.view = view;
    this.currentView = view;
    console.log(this.CalendarView);
    this.hidePopups();
  }

  showPopupOnCalendarGrid(sourceEvent: MouseEvent | KeyboardEvent) {
    const targetElement = sourceEvent.target as HTMLElement;
    const rect = targetElement.getBoundingClientRect();

    // Get the calendar view's bounding rectangle
    const calendarView = document.querySelector('.custom-calendar');
    if (!calendarView) {
      console.error('Calendar view element not found');
      return;
    }
    const calendarRect = calendarView.getBoundingClientRect();

    const popupWidth = 400; // Popup width
    const popupHeight = 200; // Popup height (assuming)
    const padding = 2; // Minimal padding between the popup and the event cell

    // Calculate the left position relative to the calendar view
    let leftPosition = rect.left - calendarRect.left + rect.width + padding;

    // Calculate the top position relative to the calendar view
    let topPosition = rect.top - calendarRect.top + padding;

    // Ensure the popup does not overflow the right side of the calendar view
    if (leftPosition + popupWidth > calendarRect.width) {
      leftPosition = rect.left - calendarRect.left - popupWidth - padding;
    }

    // Ensure the popup does not overflow the bottom of the calendar view
    if (topPosition + popupHeight > calendarRect.height) {
      topPosition = rect.top - calendarRect.top - 50;
    }

    this.popupStyle = {
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
      position: 'absolute',
    };
  }
  handleEvent(
    event: CalendarEvent,
    sourceEvent: MouseEvent | KeyboardEvent
  ): void {
    this.hidePopups();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...iEvent,
          start: newStart,
          end: newEnd,
        } as CustomCalendarEvent;
      }
      return iEvent;
    });
  }

  markAsTaskComplete(taskInfo: any) {
    console.log(taskInfo);
    this.showEventPopup = false;
    this.calendarService.confirmationModal(
      `Task Completed ?`,
      'Are you sure you want to mark this task as complete?',
      () => {
        const completedTaskStatusTypeId = this.getTaskStausTypeId('Completed');
        let payload = {
          eventTaskId: taskInfo.eventTaskId,
          eventTaskInstanceId: taskInfo.eventTaskInstanceId,
          eventTaskStatusTypeId: completedTaskStatusTypeId,
        };

        console.log(payload);
        this.eventTaskService.putEventsTasksInfo(payload).subscribe({
          next: (res: any) => {
            console.log('markascomplted Task-->', res);
            this.eventTaskService.notifyEventCreated();
            this.toaster.success('Task Completed', {
              nzDuration: 3000,
            });
            console.log('Task Completed');
          },
          error: (error) => {
            console.error('Error markascomplted Task:', error);
            this.toaster.error('Server Error', {
              nzDuration: 3000,
            });
          },
        });
      },
      'Mark as complete',
      () => {
        console.log('Cancel ');
      },
      'Cancel'
    );
  }
  formatEventDateTime(startDtm: any, endDtm: any) {
    const startDate = new Date(startDtm);
    const endDate = new Date(endDtm);
    const dayOfWeek = this.datePipe.transform(startDate, 'EEEE'); // EEEE = full weekday name
    const day = this.datePipe.transform(startDate, 'd MMM'); // d MMMM = day and full month name
    const startTime = this.datePipe.transform(startDate, 'h:mm a'); // h:mm a = 12-hour format with am/pm
    const endTime = this.datePipe.transform(endDate, 'h:mm a');

    return `${dayOfWeek}, ${day}⋅${startTime} – ${endTime}`;
  }

  formatEventRange(startDtm: any, endDtm: any) {
    const startDate = new Date(startDtm);
    const endDate = new Date(endDtm);
    const startDay = this.datePipe.transform(startDate, 'd');
    const endDay = this.datePipe.transform(endDate, 'd');
    const month = this.datePipe.transform(startDate, 'MMM');
    const monthAndYear = this.datePipe.transform(startDate, 'MMM yyyy');
    const dayOfWeek = this.datePipe.transform(startDate, 'EEEE');

    if (startDate.toDateString() === endDate.toDateString()) {
      return `${dayOfWeek}, ${startDay} ${monthAndYear}`;
    } else {
      return `${startDay} ${month} – ${endDay} ${monthAndYear}`;
    }
  }
  getVisibleEvents(events: any[]): any[] {
    return events.slice(0, 3);
  }
  eventClick(event: CalendarEvent, sourceEvent: MouseEvent | KeyboardEvent) {
    console.log(event);

    this.selectedEvent = event as CustomCalendarEvent;
    console.log('selectedEvent-->', this.selectedEvent);
    this.showEventPopup = true;
    this.isVisibleHiddenEvents = false;
    this.showPopupOnCalendarGrid(sourceEvent);
    sourceEvent.stopPropagation();

    // this.handleEvent(event, sourceEvent);
  }

  expandHiddenEvents(events: [], sourceEvent: MouseEvent | KeyboardEvent) {
    this.isVisibleHiddenEvents = true;
    this.showEventPopup = false;
    this.showPopupOnCalendarGrid(sourceEvent);
    this.allEventsIntheDay = events as CustomCalendarEvent[];
    console.log('expandHiddenEvents-->', this.allEventsIntheDay);
    sourceEvent.stopPropagation(); // Prevent any parent event handlers from being executed
  }
  hidePopups(): void {
    this.showEventPopup = false;
    this.isVisibleHiddenEvents = false;
  }

  // getTimeInTimezone(date: Date, timezone: string): string {
  //   const zonedDate = toZonedTime(date, timezone);  // Convert to zoned time
  //   return format(zonedDate, 'hh:mm a');  // Format zoned time
  // }

  getTimeInTimezone(date: Date, timezone: string): string {
    // return moment(date).tz(timezone).format('HH:mm');
    return '';
  }
}

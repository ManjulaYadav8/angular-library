import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { CalenadarService } from '../../../services/calenadar.service';
import { EventTaskService } from '../../../services/event-task.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-base-settings',
  templateUrl: './base-settings.component.html',
  styleUrl: './base-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BaseSettingsComponent implements OnInit {
  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false,
  };

  // ViewChild references for each section
  @ViewChild('settingsContent') settingsContent!: ElementRef;
  @ViewChild('timezoneSettings') timezoneSettings!: ElementRef;
  @ViewChild('eventSettings') eventSettings!: ElementRef;
  @ViewChild('taskSettings') taskSettings!: ElementRef;
  @ViewChild('notificationSettings') notificationSettings!: ElementRef;
  @ViewChild('viewSettings') viewSettings!: ElementRef;
  @ViewChild('reminderSettings') reminderSettings!: ElementRef;

  // Lookup Variables
  timezoneSettingLookup: any;
  taskSettingLookup: any;
  notificationSettingLookup: any;
  viewSettingLookup: any;
  reminderSettingLookup: any;

  // Subscription Variables
  timezoneSettingServiceData: any;
  tasksSettingServiceData: any;
  notificationSettingServiceData: any;
  viewSettingServiceData: any;
  reminderSettingServiceData: any;

  constructor(
    private _router: Router,
    private eventService: EventService,
    private calendarService: CalenadarService,
    private eventTaskService: EventTaskService,
    private toaster: NzMessageService,

  ) {}

  ngOnInit(): void {
    // console.log('base-setting-invoked');
    this.getSettingsLookupFromStorage();
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  navigateTo(section: string): void {
    let targetElement: ElementRef;

    switch (section) {
      case 'timezone':
        targetElement = this.timezoneSettings;
        break;
      case 'event':
        targetElement = this.eventSettings;
        break;
      case 'task':
        targetElement = this.taskSettings;
        break;
      case 'notification':
        targetElement = this.notificationSettings;
        break;
      case 'viewSetting':
        targetElement = this.viewSettings;
        break;
      case 'reminderSetting':
        targetElement = this.reminderSettings;
        break;
      default:
        return;
    }

    // Scroll to the target element within the settingsContent div
    this.scrollToSection(targetElement);
  }

  private scrollToSection(section: ElementRef): void {
    const settingsContentDiv = this.settingsContent.nativeElement;
    const targetPosition = section.nativeElement.offsetTop;
    settingsContentDiv.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }

  getSettingsLookupFromStorage() {
    let setting = this.eventService.getDataFromLocalStorage('settings');

    this.timezoneSettingLookup = setting.find((timezone: any) => {
      return timezone.lookup_value == 'Timezone';
    });
    this.taskSettingLookup = setting.find((timezone: any) => {
      return timezone.lookup_value == 'Task';
    });
    this.notificationSettingLookup = setting.find((timezone: any) => {
      return timezone.lookup_value == 'Notification';
    });
    this.reminderSettingLookup = setting.find((timezone: any) => {
      return timezone.lookup_value == 'Reminder';
    });
    // console.log(
    //   'this.notificationSettingLookup',
    //   this.notificationSettingLookup
    // );
    this.viewSettingLookup = setting.find((timezone: any) => {
      return timezone.lookup_value == 'View';
    });
  }

  getAllSettingsServiceData() {
    //TIMEZONE SETTINGS
    this.calendarService.timezoneData.subscribe((data) => {
      this.timezoneSettingServiceData = data;
      // console.log(
      //   'Parent received updated timezone data:',
      //   this.timezoneSettingServiceData
      // ); 

      // if (
      //   this.timezoneSettingServiceData !== null ||
      //   this.timezoneSettingServiceData !== undefined
      // ) {
      //   this.eventTaskService
      //     .createUserSetting(this.timezoneSettingServiceData)
      //     .subscribe({
      //       next: (res: any) => {
      //         console.log('create-timezone-setting-res:::', res);
      //         // this.toaster.success(res.message, {
      //         //   nzDuration: 3000,
      //         // });
      //       },
      //       error: (error) => {
      //         console.error('create-timezone-setting-error:::', error);
      //         this.toaster.error(error.message, {
      //           nzDuration: 3000,
      //         });
      //       },
      //     });
      // }
    });

    //TASKS SETTINGS
    this.calendarService.tasksData.subscribe((data) => {
      this.tasksSettingServiceData = data;
      // console.log(
      //   'Parent received updated tasks data:',
      //   this.tasksSettingServiceData
      // ); 
      // if (
      //   this.tasksSettingServiceData !== null ||
      //   this.tasksSettingServiceData !== undefined
      // ) {
      //   this.eventTaskService
      //     .createUserSetting(this.tasksSettingServiceData)
      //     .subscribe({
      //       next: (res: any) => {
      //         console.log('create-tasks-setting-res:::', res);
      //         // this.toaster.success(res.message, {
      //         //   nzDuration: 3000,
      //         // });
      //       },
      //       error: (error) => {
      //         console.error('create-tasks-setting-error:::', error);
      //         this.toaster.error(error.message, {
      //           nzDuration: 3000,
      //         });
      //       },
      //     });
      // }
    });

    //NOTIFICATION SETTINGS
    this.calendarService.notificationData.subscribe((data) => {
      this.notificationSettingServiceData = data;
      // console.log(
      //   'Parent received updated notification data:',
      //   this.notificationSettingServiceData
      // );
      // if (
      //   this.notificationSettingServiceData !== null ||
      //   this.notificationSettingServiceData !== undefined
      // ) {
      //   this.eventTaskService
      //     .createUserSetting(this.notificationSettingServiceData)
      //     .subscribe({
      //       next: (res: any) => {
      //         console.log('create-notification-setting-res:::', res);
      //         // this.toaster.success(res.message, {
      //         //   nzDuration: 3000,
      //         // });
      //       },
      //       error: (error) => {
      //         console.error('create-notification-setting-error:::', error);
      //         this.toaster.error(error.message, {
      //           nzDuration: 3000,
      //         });
      //       },
      //     });
      // }
    });

    //VIEW SETTINGS
    this.calendarService.viewSettingData.subscribe((data) => {
      this.viewSettingServiceData = data;
      // console.log(
      //   'Parent received updated view setting data:',
      //   this.viewSettingServiceData
      // );
      // if (
      //   this.viewSettingServiceData !== null ||
      //   this.viewSettingServiceData !== undefined
      // ) {
      //   this.eventTaskService
      //     .createUserSetting(this.viewSettingServiceData)
      //     .subscribe({
      //       next: (res: any) => {
      //         console.log('create-view-setting-res:::', res);
      //         // this.toaster.success(res.message, {
      //         //   nzDuration: 3000,
      //         // });
      //       },
      //       error: (error) => {
      //         console.error('create-view-setting-error:::', error);
      //         this.toaster.error(error.message, {
      //           nzDuration: 3000,
      //         });
      //       },
      //     });
      // }
    });

    //REMINDER SETTINGS
    this.calendarService.defaultReminderData.subscribe((data) => {
      this.reminderSettingServiceData = data;
      // console.log(
      //   'Parent received updated reminder data:',
      //   this.reminderSettingServiceData
      // ); 
      // if (
      //   this.reminderSettingServiceData !== null ||
      //   this.reminderSettingServiceData !== undefined
      // ) {
      //   this.eventTaskService
      //     .createUserSetting(this.reminderSettingServiceData)
      //     .subscribe({
      //       next: (res: any) => {
      //         console.log('create-reminder-setting-res:::', res);
      //         // this.toaster.success(res.message, {
      //         //   nzDuration: 3000,
      //         // });
      //       },
      //       error: (error) => {
      //         console.error('create-reminder-setting-error:::', error);
      //         this.toaster.error(error.message, {
      //           nzDuration: 3000,
      //         });
      //       },
      //     });
      // }
    });

   
  }

  cancelSetting(){
    this._router.navigate(['/calendar'])
  }
}

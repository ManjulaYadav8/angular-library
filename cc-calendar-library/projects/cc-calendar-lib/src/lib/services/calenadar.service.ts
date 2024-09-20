import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root',
})
export class CalenadarService {
  settingsArr: Array<any> = [];

  private timezoneDataSubject = new BehaviorSubject<any>(null);
  timezoneData = this.timezoneDataSubject.asObservable();

  private tasksDataSubject = new BehaviorSubject<any>(null);
  tasksData = this.tasksDataSubject.asObservable();

  private notificationDataSubject = new BehaviorSubject<any>(null);
  notificationData = this.notificationDataSubject.asObservable();

  private viewSettingDataSubject = new BehaviorSubject<any>(null);
  viewSettingData = this.viewSettingDataSubject.asObservable();

  private defaultReminderDataSubject = new BehaviorSubject<any>(null);
  defaultReminderData = this.defaultReminderDataSubject.asObservable();

  constructor(private modal: NzModalService) {}

  private isSidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  isSidebarCollapsed$ = this.isSidebarCollapsedSubject.asObservable();

  toggleSidebar() {
    this.isSidebarCollapsedSubject.next(!this.isSidebarCollapsedSubject.value);
  }
  confirmationModal(
    title: string,
    content: string,
    onOk: () => void,
    okText: string = 'OK',
    onCancel?: () => void,
    cancelText: string = 'Cancel'
  ): void {
    this.modal.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: okText,
      nzCancelText: cancelText,
      nzOnOk: () => onOk(),
      nzOnCancel: () => (onCancel ? onCancel() : undefined),
    });
  }

  receiveTimeZoneData(data: any) {
    // console.log('Received data from child:', data); // Log the data received from child
    // console.log('Previous timezone data:', this.timezoneDataSubject.value); // Log the current value before updating
    // Update the BehaviorSubject with the new data
    this.timezoneDataSubject.next(data);
    console.log('New timezone data set:', this.timezoneDataSubject.value); // Log the updated value after the change
    // this.settingsArr.push(this.timezoneDataSubject.value);
    // console.log(this.settingsArr)
  }

  receiveTasksData(data: any) {
    console.log('Received tasks data from child:', data); // Log the data received from child
    // console.log('Previous timezone data:', this.tasksDataSubject.value); // Log the current value before updating
    // Update the BehaviorSubject with the new data
    this.tasksDataSubject.next(data);
    console.log('New tasks data set:', this.tasksDataSubject.value); // Log the updated value after the change
    // this.settingsArr.push(this.tasksDataSubject.value);
    // console.log(this.settingsArr)
  }

  receiveNotificationData(data: any) {
    console.log('Received notif data from child:', data); // Log the data received from child
    // console.log('Previous notificationDataSubject data:', this.notificationDataSubject.value); // Log the current value before updating
    // Update the BehaviorSubject with the new data
    this.notificationDataSubject.next(data);
    console.log('New notification data set:', this.notificationDataSubject.value); // Log the updated value after the change
    // this.settingsArr.push(this.notificationDataSubject.value);
    // console.log(this.settingsArr)
  }

  receiveViewSettingsData(data: any) {
    console.log('Received view settings data from child:', data); // Log the data received from child
    // console.log('Previous notificationDataSubject data:', this.notificationDataSubject.value); // Log the current value before updating
    // Update the BehaviorSubject with the new data
    this.viewSettingDataSubject.next(data);
    console.log('New viewSettingDataSubject data set:', this.viewSettingDataSubject.value); // Log the updated value after the change
    // this.settingsArr.push(this.viewSettingDataSubject.value);
    // console.log(this.settingsArr)
  }

  receiveDefaultReminderData(data: any) {
    console.log('Received default reminder data from child:', data); // Log the data received from child
    // console.log('Previous notificationDataSubject data:', this.notificationDataSubject.value); // Log the current value before updating
    // Update the BehaviorSubject with the new data
    this.defaultReminderDataSubject.next(data);
    console.log('New default reminder data set:', this.defaultReminderDataSubject.value); // Log the updated value after the change
    // this.settingsArr.push(this.viewSettingDataSubject.value);
    // console.log(this.settingsArr)
  }
}

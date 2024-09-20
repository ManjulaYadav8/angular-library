import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CalenadarService } from '../../../../services/calenadar.service';
import { EventTaskService } from '../../../../services/event-task.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationSettingsComponent implements OnInit {
  notificationSettingForm: FormGroup;
  notifAlertType = ['off', 'alerts'];
  @Input() baseSettingLookup: any; // Data from parent (base-setting)

  constructor(
    private fb: FormBuilder,
    private _calenderService: CalenadarService,
    private eventTaskService: EventTaskService
  ) {
    this.notificationSettingForm = this.fb.group({
      // notification_alerts: ['off'],
      settings_type_id: [null],
      setting_value: this.fb.group({
        notification_alerts: ['off', [Validators.required]],
      }),
      user_id: [-1],
      status: [1],
    });
  }

  ngOnInit(): void {
    // console.log('notification-setting-invoked');
    // console.log(
    //   'baseSettingLookup-notification-setting',
    //   this.baseSettingLookup.lookup_id
    // );
    this.notificationSettingForm.patchValue({
      settings_type_id: this.baseSettingLookup.lookup_id, // Patch the lookup_id value
    });
    // Subscribe to form value changes and log the current form value
    this.notificationSettingForm.valueChanges.subscribe((formValue: any) => {
      // console.log('Notification Form Value Changed:', formValue);
      this._calenderService.receiveNotificationData(formValue);
    });

    this.patchUserSettingsFromLocalStorage();
  }

  patchUserSettingsFromLocalStorage() {
    let userSetting =
      this.eventTaskService.getDataFromLocalStorage('user-settings');
    // console.log('userSetting from local:::', userSetting);
    let localStorageData = userSetting.find((userSetting: any) => {
      return userSetting.settings_type_id == this.baseSettingLookup.lookup_id;
    });
    // console.log(localStorageData);
    // Patch the form
    this.notificationSettingForm.patchValue({
      settings_type_id: localStorageData.settings_type_id,
      setting_value: {
        notification_alerts: localStorageData.setting_value.notification_alerts,
      },
      user_id: localStorageData.user_id,
      status: localStorageData.status,
    });
  }

  onSubmit(): void {
    if (this.notificationSettingForm.valid) {
      const formData = this.notificationSettingForm.value;
      // console.log('Notif form submitted:', formData);
      // Handle form submission
    }
  }
}

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CalenadarService } from '../../../../services/calenadar.service';
import { EventTaskService } from '../../../../services/event-task.service';

@Component({
  selector: 'app-reminder-settings',
  templateUrl: './reminder-settings.component.html',
  styleUrl: './reminder-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReminderSettingsComponent implements OnInit {
  reminderSettingsForm: FormGroup;
  guestPermissions = ['all', 'business partner', 'business user'];
  timeUnitsList: any[] = ['minutes', 'hours', 'days', 'weeks'];
  taskreminderTime: number = 12; // Default time value
  eventreminderTime: number = 12; // Default time value
  timeUnit: string = 'hours'; // Default time unit

  eventDefaultReminderArr: Array<any> = [];
  @Input() baseSettingLookup: any; // Data from parent (base-setting)

  constructor(
    private fb: FormBuilder,
    private _calenderService: CalenadarService,
    private eventTaskService: EventTaskService
  ) {
    this.reminderSettingsForm = this.fb.group({
      settings_type_id: [null],
      setting_value: this.fb.group({
        task_reminder_interval: [null],
        task_reminder_uom: ['hours'],
        event_reminder_interval: [null],
        event_reminder_uom: ['hours'],
      }),
      user_id: [-1],
      status: [1],
    });
  }

  ngOnInit(): void {
    this.reminderSettingsForm.patchValue({
      settings_type_id: this.baseSettingLookup.lookup_id, // Patch the lookup_id value
    });

    // this.taskSettingsForm.get('setting_value')?.patchValue({
    //   default_guest_permissions: 'all',
    //   calendar_invitation: 'all',
    // });
    // Subscribe to form value changes and log the current form value
    this.reminderSettingsForm.valueChanges.subscribe((formValue: any) => {
      // console.log('Reminder Form Value Changed:', formValue);
      this._calenderService.receiveDefaultReminderData(formValue);
    });

    this.patchUserSettingsFromLocalStorage();
  }

  decreaseReminderTimeTasks() {
    this.taskreminderTime -= 1;
    if (this.taskreminderTime <= 0) {
      this.taskreminderTime = 1;
    }

    this.reminderSettingsForm.patchValue({
      setting_value: {
        task_reminder_interval: this.taskreminderTime,
      },
    });
  }
  increaseReminderTimeTasks() {
    this.taskreminderTime += 1;
    this.reminderSettingsForm.patchValue({
      setting_value: {
        task_reminder_interval: this.taskreminderTime,
      },
    });
  }

  decreaseReminderTimeEvent() {
    this.eventreminderTime -= 1;
    if (this.eventreminderTime <= 0) {
      this.eventreminderTime = 1;
    }
    this.reminderSettingsForm.patchValue({
      setting_value: {
        event_reminder_interval: this.eventreminderTime,
      },
    });
  }
  increaseReminderTimeEvent() {
    this.eventreminderTime += 1;
    this.reminderSettingsForm.patchValue({
      setting_value: {
        event_reminder_interval: this.eventreminderTime,
      },
    });
  }

  // createReminders() {
  //   return this.fb.group({
  //     reminderInterval: [12],
  //     reminderUOM: ['hours'],
  //   });
  // }
  // get defaultReminders(): FormArray {
  //   return this.reminderSettingsForm.get('defaultReminders') as FormArray;
  // }
  // addReminderRow(): FormGroup {
  //   // let reminderObj: Object = {
  //   //   reminder_interval: 12,
  //   //   reminder_interval_uom: null,
  //   // };
  //   // console.log(reminderObj);
  //   // this.eventDefaultReminderArr.push(reminderObj);
  //   // this.reminderSettingsForm.patchValue({
  //   //   defaultReminders: this.eventDefaultReminderArr,
  //   // });
  //   // console.log(this.reminderSettingsForm);

  //   return this.fb.group({
  //     reminder_interval: [10],
  //     reminder_interval_uom: ['minutes'],
  //   });
  // }
  // addReminder(): void {
  //   this.defaultReminders.push(
  //     this.fb.group({
  //       reminderInterval: [10],
  //       reminderUOM: ['minutes'],
  //     })
  //   );
  //   console.log(this.defaultReminders);
  // }

  // removeReminder(index: number): void {
  //   if (this.defaultReminders.length > 1) {
  //     this.defaultReminders.removeAt(index);
  //   }
  // }

  patchUserSettingsFromLocalStorage() {
    let userSetting =
      this.eventTaskService.getDataFromLocalStorage('user-settings');
    console.log('userSetting from local:::', userSetting);
    let localStorageData = userSetting.find((userSetting: any) => {
      return userSetting.settings_type_id == this.baseSettingLookup.lookup_id;
    });
    console.log(localStorageData);
    // Patch the form
    this.reminderSettingsForm.patchValue({
      settings_type_id: localStorageData.settings_type_id,
      setting_value: {
        task_reminder_interval:
          localStorageData.setting_value.task_reminder_interval,
        task_reminder_uom: localStorageData.setting_value.task_reminder_uom,
      },
      user_id: localStorageData.user_id,
      status: localStorageData.status,
    });
  }
  onSubmit(): void {
    if (this.reminderSettingsForm.valid) {
      const formData = this.reminderSettingsForm.value;
      // console.log('Form submitted:', formData);
      // Handle form submission
    }
  }
}

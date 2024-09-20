import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CalenadarService } from '../../../../services/calenadar.service';
import { EventTaskService } from '../../../../services/event-task.service';

@Component({
  selector: 'app-task-settings',
  templateUrl: './task-settings.component.html',
  styleUrl: './task-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TaskSettingsComponent implements OnInit {
  taskSettingsForm: FormGroup;
  guestPermissions = ['all', 'business partner', 'business user'];
  timeUnitsList: any[] = ['minutes', 'hours', 'Days', 'weeks'];
  reminderTime: number = 12; // Default time value
  timeUnit: string = 'hours'; // Default time unit

  eventDefaultReminderArr: Array<any> = [];
  @Input() baseSettingLookup: any; // Data from parent (base-setting)

  constructor(
    private fb: FormBuilder,
    private _calenderService: CalenadarService,
    private eventTaskService: EventTaskService
  ) {
    this.taskSettingsForm = this.fb.group({
      settings_type_id: [null],
      setting_value: this.fb.group({
        default_guest_permissions: ['all', [Validators.required]],
        calendar_invitation: ['all'],
      }),
      user_id: [-1],
      status: [1],
    });
  }

  ngOnInit(): void {
    // console.log('task-setting-invoked');
    // console.log(
    //   'baseSettingLookup-task-setting',
    //   this.baseSettingLookup.lookup_id
    // );
    // Patch baseSettingLookup.lookup_id to the settings_type_id form control
    this.taskSettingsForm.patchValue({
      settings_type_id: this.baseSettingLookup.lookup_id, // Patch the lookup_id value
    });

    // this.taskSettingsForm.get('setting_value')?.patchValue({
    //   default_guest_permissions: 'all',
    //   calendar_invitation: 'all',
    // });
    // Subscribe to form value changes and log the current form value
    this.taskSettingsForm.valueChanges.subscribe((formValue: any) => {
      // console.log('Task Form Value Changed:', formValue);
      this._calenderService.receiveTasksData(formValue);
    });

    this.patchUserSettingsFromLocalStorage();
  }

  decreaseReminderTime() {
    this.reminderTime -= 1;
    if (this.reminderTime <= 0) {
      this.reminderTime = 1;
    }
  }
  increaseReminderTime() {
    this.reminderTime += 1;
  }

  createReminders() {
    return this.fb.group({
      reminderInterval: [12],
      reminderUOM: ['hours'],
    });
  }
  get defaultReminders(): FormArray {
    return this.taskSettingsForm.get('defaultReminders') as FormArray;
  }
  addReminderRow(): FormGroup {
    // let reminderObj: Object = {
    //   reminder_interval: 12,
    //   reminder_interval_uom: null,
    // };
    // console.log(reminderObj);
    // this.eventDefaultReminderArr.push(reminderObj);
    // this.taskSettingsForm.patchValue({
    //   defaultReminders: this.eventDefaultReminderArr,
    // });
    // console.log(this.taskSettingsForm);

    return this.fb.group({
      reminder_interval: [10],
      reminder_interval_uom: ['minutes'],
    });
  }
  addReminder(): void {
    this.defaultReminders.push(
      this.fb.group({
        reminderInterval: [10],
        reminderUOM: ['minutes'],
      })
    );
    console.log(this.defaultReminders);
  }

  removeReminder(index: number): void {
    if (this.defaultReminders.length > 1) {
      this.defaultReminders.removeAt(index);
    }
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
    this.taskSettingsForm.patchValue({
      settings_type_id: localStorageData.settings_type_id,
      setting_value: {
        calendar_invitation: localStorageData.setting_value.calendar_invitation,
        default_guest_permissions:
          localStorageData.setting_value.default_guest_permissions,
      },
      user_id: localStorageData.user_id,
      status: localStorageData.status,
    });
  }
  onSubmit(): void {
    if (this.taskSettingsForm.valid) {
      const formData = this.taskSettingsForm.value;
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  }
}

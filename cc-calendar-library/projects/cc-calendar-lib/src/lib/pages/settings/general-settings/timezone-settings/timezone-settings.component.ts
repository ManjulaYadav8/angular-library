import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalenadarService } from '../../../../services/calenadar.service';
import { EventTaskService } from '../../../../services/event-task.service';

@Component({
  selector: 'app-timezone-settings',
  templateUrl: './timezone-settings.component.html',
  styleUrl: './timezone-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimezoneSettingsComponent {
  timezoneForm: any;
  timezones = [
    {
      label: '(GMT+05:30) Indian Standard Time - Kolkata',
      value: '(GMT+05:30) Indian Standard Time - Kolkata',
    },
    {
      label: '(GMT+00:00) Coordinated Universal Time',
      value: '(GMT+00:00) Coordinated Universal Time',
    },
    {
      label: '(GMT+01:00) Central European Time',
      value: '(GMT+01:00) Central European Time',
    },
    {
      label: '(GMT-05:00) Eastern Standard Time (US & Canada)',
      value: '(GMT-05:00) Eastern Standard Time (US & Canada)',
    },
    // Add more timezones as needed
  ];
  @Input() baseSettingLookup: any;

  constructor(
    private fb: FormBuilder,
    private _calenderService: CalenadarService,
    private eventTaskService: EventTaskService
  ) {}

  ngOnInit(): void {
    this.timezoneForm = this.fb.group({
      settings_type_id: [null],
      setting_value: this.fb.group({
        add_secondary_timezone: [false],
        primary_timezone: [null, [Validators.required]],
        secondary_timezone: [{ value: null, disabled: true }],
      }),
      user_id: [-1],
      status: [1],
    });

    // Enable/Disable secondary timezone field based on checkbox state
    this.timezoneForm
      .get('setting_value.add_secondary_timezone')
      ?.valueChanges.subscribe((checked: boolean) => {
        if (checked) {
          this.timezoneForm.get('setting_value.secondary_timezone')?.enable();
        } else {
          this.timezoneForm.patchValue({
            setting_value: {
              secondary_timezone: null,
            },
          });
          this.timezoneForm.get('setting_value.secondary_timezone')?.disable();
        }
      });

    // Patch baseSettingLookup.lookup_id to the settings_type_id form control
    this.timezoneForm.patchValue({
      settings_type_id: this.baseSettingLookup.lookup_id, // Patch the lookup_id value
    });

    // console.log('baseSettingLookup-timezone', this.baseSettingLookup.lookup_id);

    // Subscribe to form value changes and log the current form value
    this.timezoneForm.valueChanges.subscribe((formValue: any) => {
      // console.log('Timezone Form Value Changed:', formValue);
      this._calenderService.receiveTimeZoneData(formValue);
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
    this.timezoneForm.patchValue({
      settings_type_id: localStorageData.settings_type_id,
      setting_value: {
        primary_timezone: localStorageData.setting_value.primary_timezone,
        add_secondary_timezone:
          localStorageData.setting_value.add_secondary_timezone,
      },
      user_id: localStorageData.user_id,
      status: localStorageData.status,
    });

    // Enable secondary_timezone field if add_secondary_timezone is true
    if (localStorageData.setting_value.add_secondary_timezone) {
      this.timezoneForm.get('setting_value.secondary_timezone').enable();
      this.timezoneForm.patchValue({
        setting_value: {
          secondary_timezone: localStorageData.setting_value.secondary_timezone,
        },
      });
    }
  }

  onSubmit(): void {
    if (this.timezoneForm.valid) {
      const formData = this.timezoneForm.value;
      // console.log('Form submitted:', formData);
      // Handle form submission
    }
  }
}

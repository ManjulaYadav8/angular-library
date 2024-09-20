import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalenadarService } from '../../../../services/calenadar.service';
import { EventTaskService } from '../../../../services/event-task.service';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrl: './view-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ViewSettingsComponent implements OnInit {
  viewSettingForm: FormGroup;
  notifAlertType = ['off', 'alerts'];
  @Input() baseSettingLookup: any; // Data from parent (base-setting)

  constructor(
    private fb: FormBuilder,
    private _calenderService: CalenadarService,
    private eventTaskService: EventTaskService
  ) {
    this.viewSettingForm = this.fb.group({
      settings_type_id: [null],
      setting_value: this.fb.group({
        view_completed_tasks: [false],
        view_suspended_tasks: [false],
        // view_completed_events: [false],
        // view_suspended_events: [false],
      }),
      user_id: [-1],
      status: [1],
    });
  }

  ngOnInit(): void {
    // console.log('view-setting-invoked');
    // console.log(
    //   'baseSettingLookup-view-setting',
    //   this.baseSettingLookup.lookup_id
    // );
    this.viewSettingForm.patchValue({
      settings_type_id: this.baseSettingLookup.lookup_id, // Patch the lookup_id value
    });
    // Subscribe to form value changes and log the current form value
    this.viewSettingForm.valueChanges.subscribe((formValue: any) => {
      // console.log('View Setting Form Value Changed:', formValue);
      this._calenderService.receiveViewSettingsData(formValue);
    });
    this.patchUserSettingsFromLocalStorage();
  }
  patchUserSettingsFromLocalStorage() {
    let userSetting =
      this.eventTaskService.getDataFromLocalStorage('user-settings');
    console.log('userSetting from local:::', userSetting);
    let localStorageData = userSetting.find((userSetting: any) => {
      return userSetting.settings_type_id == this.baseSettingLookup.lookup_id;
    });
    console.log(localStorageData);
    // Patch the form
    this.viewSettingForm.patchValue({
      settings_type_id: localStorageData.settings_type_id,
      setting_value: {
        view_completed_tasks:
          localStorageData.setting_value.view_completed_tasks,
        view_suspended_tasks:
          localStorageData.setting_value.view_suspended_tasks,
      },
      user_id: localStorageData.user_id,
      status: localStorageData.status,
    });
  }
  onSubmit(): void {
    if (this.viewSettingForm.valid) {
      const formData = this.viewSettingForm.value;
      // console.log('Notif form submitted:', formData);
      // Handle form submission
    }
  }
}

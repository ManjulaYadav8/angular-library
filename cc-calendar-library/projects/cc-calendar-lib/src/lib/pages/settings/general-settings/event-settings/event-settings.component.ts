import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-event-settings',
  templateUrl: './event-settings.component.html',
  styleUrl: './event-settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EventSettingsComponent implements OnInit {
  eventSettingsForm: FormGroup;
  guestPermissions = ['all', 'business partner', 'business user'];
  timeUnitsList: any[] = ['minutes', 'hours', 'Days', 'weeks'];
  reminderTime: number = 12; // Default time value
  timeUnit: string = 'hours'; // Default time unit

  eventDefaultReminderArr: Array<any> = [];
  constructor(private fb: FormBuilder) {
    this.eventSettingsForm = this.fb.group({
      defaultGuestPermissions: ['all', [Validators.required]],
      calendarInvitations: ['all'],
      defaultReminders: this.fb.array([this.addReminderRow()]),
    });
  }

  ngOnInit(): void {
    // this.addReminderRow();
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
    return this.eventSettingsForm.get('defaultReminders') as FormArray;
  }
  addReminderRow(): FormGroup {
    // let reminderObj: Object = {
    //   reminder_interval: 12,
    //   reminder_interval_uom: null,
    // };
    // console.log(reminderObj);
    // this.eventDefaultReminderArr.push(reminderObj);
    // this.eventSettingsForm.patchValue({
    //   defaultReminders: this.eventDefaultReminderArr,
    // });
    // console.log(this.eventSettingsForm);

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
  onSubmit(): void {
    if (this.eventSettingsForm.valid) {
      const formData = this.eventSettingsForm.value;
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  }
}

import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EventTaskService } from '../../../services/event-task.service';
import { RecurrenceService } from '../../../services/recurrence.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CreateEventComponent implements OnInit {
  @Output() submitEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  eventForm: FormGroup;
  recursiveEventForm: FormGroup;
  isVisibleCustomPopup = false;
  isOkLoading = false;

  // eventAssigneeDetails  variables
  selectedCompany: string = '';
  selectedDepartment: string = '';
  selectedUsers: any = [];
  companies: any = [
    {
      id: '1',
      name: 'Company A',
    },
    {
      id: '2',
      name: 'Company B',
    },
    {
      id: '3',
      name: 'Company C',
    },
  ];
  departments: any = [
    {
      id: '1',
      name: 'Department A',
      companyId: '1',
    },
    {
      id: '2',
      name: 'Department B',
      companyId: '1',
    },
    {
      id: '3',
      name: 'Department C',
      companyId: '2',
    },
    {
      id: '4',
      name: 'Department D',
      companyId: '2',
    },
    {
      id: '5',
      name: 'Department E',
      companyId: '3',
    },
  ];
  users: any = [
    {
      id: '1',
      name: 'User A',
      departmentId: '1',
    },
    {
      id: '2',
      name: 'User B',
      departmentId: '2',
    },
    {
      id: '3',
      name: 'User C',
      departmentId: '3',
    },
    {
      id: '4',
      name: 'User D',
      departmentId: '4',
    },
    {
      id: '5',
      name: 'User E',
      departmentId: '5',
    },
  ];

  //eventReminderDetails details

  reminderUOMList: any = ['hours', 'minutes', 'days', 'weeks'];
  selectedInterval: number = 0;
  selectedUOM: string = '';
  reminderIntervalMaxValue: number = 0;
  reminderIntervalMinValue: number = 0;

  eventStartTime: any;
  eventEndTime: any;
  eventStartDate: Date = new Date();

  isRecursiveChecked: boolean = false;
  daysOfWeek: any = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  repeatEveryOptions: any[] = ['day', 'week', 'month'];
  selectedOption = 'day';
  repeatEveryMinValue: any = 1;
  repeatEveryMaxValue: any = 366;
  selectedMonthlyRepeatOnOption: any = '';
  currentWeekOfMonth: number = 0;
  currentDate: number = new Date().getDate();
  occurrenceInMonth: string = '';
  currentDayOfWeek: string = '';
  recurrenceDescription: string = '';
  todaysDate: Date = new Date();

  // weekDays: any = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weekDays: any = [
    { index: 1, value: 'S' },
    { index: 2, value: 'M' },
    { index: 3, value: 'T' },
    { index: 4, value: 'W' },
    { index: 5, value: 'T' },
    { index: 6, value: 'F' },
    { index: 7, value: 'S' },
  ];
  selectedCustomWeekDays: string[] = [];

  timezones = [
    { name: '(GMT+05:30) Indian Standard Time', value: 'GMT+05:30' },
    { name: '(GMT-12:00) International Date Line West', value: 'GMT-12:00' },
    { name: '(GMT-11:00) Samoa', value: 'GMT-11:00' },
    { name: '(GMT-10:00) Hawaii', value: 'GMT-10:00' },
    { name: '(GMT-09:00) Alaska', value: 'GMT-09:00' },
    { name: '(GMT-08:00) Pacific Time (US & Canada)', value: 'GMT-08:00' },
    { name: '(GMT+00:00) Greenwich Mean Time', value: 'GMT+00:00' },
    { name: '(GMT+01:00) Central European Time', value: 'GMT+01:00' },

    { name: '(GMT+09:00) Japan Standard Time', value: 'GMT+09:00' },
    { name: '(GMT+12:00) Auckland', value: 'GMT+12:00' },
    // Continue the list...
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private datePipe: DatePipe,
    private eventTaskService: EventTaskService,
    private recurrenceService: RecurrenceService
  ) {
    this.eventForm = this.fb.group({
      title: [null, [Validators.required]], // for title
      description: [null], // for description
      subject: [null, [Validators.required]], // for subject
      startDate: [this.todaysDate, [Validators.required]], // for startDate (date and time)
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]], // for endTime (time only)
      timezone: ['(GMT+05:30) Indian Standard Time'], // for timezone
      eventAssigneeDetails: this.fb.array([this.createAssigneeDetail()], {
        validators: this.companyUsersValidator(),
      }), // Initialize with one assignee detail
      eventReminderDetails: this.fb.array([this.createReminderDetails()]),
    });

    this.recursiveEventForm = this.fb.group({
      userId: 1,
      eventTaskTypeId: this.eventTaskService.getEventTypeLookupIdByValue('Custom Events'),
      isTask: [false],
      isHighPriority: [false],
      isRecurring: [false],
      isAllDayEvent: [false],
      recurrenceTypeId: ['none'],
      separationCount: [0],
      maxOccurences: [null],
      recurrencePattern: this.fb.array([]),
      recurrenceEndDate: [null],
    });
  }

  ngOnInit() {
    console.log('create event modal component');
    this.getWeekOfMonthOccurenceOfEventStartDate(this.todaysDate);
  }

  ///-----------------------------------event start time and end time Detail----------------------------

  startTimeLog(value: Date): void {
    console.log(value);
    if (value != null) {
      const date = new Date(this.eventStartTime);
      const timeString = date.toLocaleTimeString('en-GB'); // Use 'en-GB' or another locale to get 'HH:mm:ss' format
      console.log(timeString);
      if (this.eventEndTime && this.eventEndTime <= this.eventStartTime) {
        this.eventEndTime = null; // Reset end time
      }
      this.eventForm.patchValue({
        startTime: timeString,
      });
    } else {
      this.eventForm.patchValue({
        startTime: null,
        endTime: null,
      });
      this.eventEndTime = null;
      this.eventStartTime = null;
    }
  }
  endTimeLog(value: Date): void {
    if (value != null) {
      const date = new Date(this.eventEndTime);
      const timeString = date.toLocaleTimeString('en-GB'); // Use 'en-GB' or another locale to get 'HH:mm:ss' format
      console.log(timeString);

      this.eventForm.patchValue({
        endTime: timeString,
      });
    } else {
      this.eventEndTime = null;
      this.eventStartTime = null;
      this.eventForm.patchValue({
        startTime: null,
        endTime: null,
      });
    }
  }

  disabledEndHours = (): number[] => {
    if (!this.eventStartTime) {
      return [];
    }
    const startHour = this.eventStartTime.getHours();
    return Array.from({ length: startHour }, (_, i) => i); // Disable hours less than the start hour
  };

  disabledEndMinutes = (hour: number): number[] => {
    if (!this.eventStartTime || hour > this.eventStartTime.getHours()) {
      return [];
    }
    if (hour === this.eventStartTime.getHours()) {
      const startMinute = this.eventStartTime.getMinutes();
      return Array.from({ length: startMinute }, (_, i) => i); // Disable minutes less than start time's minutes
    }
    return [];
  };
  disabledDate = (current: Date): boolean => {
    if (!current) {
      return false;
    }
    // Get the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable all dates before today (excluding today)
    return current < today;
  };
  eventStartDateClick(value: Date) {
    console.log('eventStartDateClick-->', new Date(value));
    this.getWeekOfMonthOccurenceOfEventStartDate(new Date(value));
    this.eventForm.patchValue({
      startDate: value,
    });
  }

  ///-----------------------------------createAssigneeDetail----------------------------

  get eventAssigneeDetails(): FormArray {
    return this.eventForm.get('eventAssigneeDetails') as FormArray;
  }

  createAssigneeDetail(): FormGroup {
    return this.fb.group({
      level: '1',
      company: [null],
      department: [null],
      users: this.fb.array([]), // Initialize an empty FormArray for users
    });
  }
  companyUsersValidator(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      const formArrayControl = formArray as FormArray;

      for (const control of formArrayControl.controls) {
        const companyControl = control.get('company');
        const usersControl = control.get('users') as FormArray;

        if (companyControl?.value && usersControl?.length === 0) {
          return { companyUsersRequired: true };
        }
      }

      return null;
    };
  }

  onCompanySelect(selectedCompany: any, index: number) {
    console.log('hdbhbfdf', selectedCompany);
    const assigneeGroup = this.eventAssigneeDetails.at(index);

    if (assigneeGroup) {
      assigneeGroup.patchValue({ company: selectedCompany });
    }
  }

  onDepartmentSelect(department: any, index: number) {
    const assigneeGroup = this.eventAssigneeDetails.at(index);
    assigneeGroup.patchValue({ department: department });
  }

  onUserSelect(users: any[], index: number) {
    const assigneeGroup = this.eventAssigneeDetails.at(index) as FormGroup;
    const usersArray = assigneeGroup.get('users') as FormArray;

    // Clear the current users
    usersArray.clear();

    // Add the selected users
    users.forEach((user) => {
      usersArray.push(
        this.fb.group({
          user_id: user.id,
          user_name: user.name,
        })
      );
    });
  }

  //------------------------create eventReminderDetails ----------------------------

  get eventReminderDetails(): FormArray {
    return this.eventForm.get('eventReminderDetails') as FormArray;
  }

  createReminderDetails(): FormGroup {
    return this.fb.group({
      reminderInterval: [10],
      reminderUOM: ['minutes'],
    });
  }

  onReminderIntervalSelect(timeInterval: any, index: number) {
    console.log(timeInterval);

    const remindersGroup = this.eventReminderDetails.at(index);

    if (timeInterval) {
      this.selectedInterval = 1;
      remindersGroup.patchValue({ reminderInterval: timeInterval });
    }
  }

  onReminderUomSelect(uom: string, index: number) {
    const remindersGroup = this.eventReminderDetails.at(index);
    if (uom) {
      remindersGroup.patchValue({ reminderUOM: uom });
      switch (uom) {
        case 'minutes':
          this.reminderIntervalMinValue = 1;
          this.reminderIntervalMaxValue = 1440;
          break;
        case 'hours':
          this.reminderIntervalMinValue = 1;
          this.reminderIntervalMaxValue = 84;
          break;
        case 'days':
          this.reminderIntervalMinValue = 1;
          this.reminderIntervalMaxValue = 28;
          break;
        case 'weeks':
          this.reminderIntervalMinValue = 1;
          this.reminderIntervalMaxValue = 4;
          break;
      }
    }
  }
  addReminder(): void {
    this.eventReminderDetails.push(
      this.fb.group({
        reminderInterval: [null],
        reminderUOM: [null],
      })
    );
    console.log(this.eventReminderDetails);
  }

  removeReminder(index: number): void {
    if (this.eventReminderDetails.length > 1) {
      this.eventReminderDetails.removeAt(index);
    }
  }

  // ----------------------custom recursive functionlities----------------------
  showCustomRecusrsiveModal(): void {
    this.isVisibleCustomPopup = true;
  }
  addValidatorsToRecursiveForm() {
    this.recursiveEventForm
      .get('isRecurring')
      ?.valueChanges.subscribe((isRecurring) => {
        if (isRecurring) {
          // Add required validation when isRecurring is true
          this.recursiveEventForm
            .get('separationCount')
            ?.setValidators([Validators.required, Validators.min(1)]);
          this.recursiveEventForm
            .get('recurrenceTypeId')
            ?.setValidators([Validators.required]);
          this.recursiveEventForm.get('recurrencePattern')?.setValidators([]);
          this.recursiveEventForm
            .get('recurrenceEndDate')
            ?.setValidators([Validators.required]);
        } else {
          // Clear validators when isRecurring is false
          this.recursiveEventForm.get('separationCount')?.clearValidators();
          this.recursiveEventForm.get('recurrenceTypeId')?.clearValidators();
          this.recursiveEventForm.get('recurrencePattern')?.clearValidators();
          this.recursiveEventForm.get('recurrenceEndDate')?.clearValidators();
        }

        // Update validation state
        this.recursiveEventForm
          .get('separationCount')
          ?.updateValueAndValidity();
        this.recursiveEventForm
          .get('recurrenceTypeId')
          ?.updateValueAndValidity();
        this.recursiveEventForm
          .get('recurrencePattern')
          ?.updateValueAndValidity();
        this.recursiveEventForm
          .get('recurrenceEndDate')
          ?.updateValueAndValidity();
      });
  }

  isRecursiveCheckbox() {
    console.log(this.isRecursiveChecked);
    this.addValidatorsToRecursiveForm();
    if (this.isRecursiveChecked) {
      this.recursiveEventForm.patchValue({
        isRecurring: true,
        recurrenceTypeId: null,
        separationCount: 0,
        recurrenceEndDate: null,
      });
    } else {
      this.recurrenceDescription = '';
      this.recurrencePattern.clear();
      this.recursiveEventForm.patchValue({
        isRecurring: false,
        recurrenceTypeId: null,
        separationCount: 0,
        recurrenceEndDate: null,
      });

      // this.recursiveEventForm.reset();
    }
    console.log(this.recursiveEventForm.value);
  }
  get recurrencePattern(): FormArray {
    return this.recursiveEventForm.get('recurrencePattern') as FormArray;
  }
  createRecurrenceTypes(): FormGroup {
    return this.fb.group({
      dayOfWeek: [null],
      dayOfMonth: [null],
      weekOfMonth: [null],
      monthOfYear: [null], // Initialize an empty FormArray for users
    });
  }

  getCurrentDayOfWeek(): string {
    const currentDayIndex = new Date(this.eventStartDate).getDay();
    return this.daysOfWeek[currentDayIndex];
  }

  getWeekOfMonthOccurenceOfEventStartDate(date: Date) {
    let data: any =
      this.recurrenceService.getCurrentOccurrenceOfEventStartDay(date);
    console.log(data);
    this.currentWeekOfMonth = data.currentWeekOfMonth;
    this.occurrenceInMonth = `${data.ordinalOccurrence} ${data.currentDay}`;
  }

  onRepeatEveryOptionChange(): void {
    switch (this.selectedOption) {
      case 'day':
        this.repeatEveryMinValue = 1;
        this.repeatEveryMaxValue = 366;
        break;
      case 'week':
        this.repeatEveryMinValue = 1;
        this.repeatEveryMaxValue = 53;
        break;
      case 'month':
        this.repeatEveryMinValue = 1;
        this.repeatEveryMaxValue = 92;
        break;
    }
    this.recursiveEventForm.patchValue({
      recurrenceTypeId: this.selectedOption,
      separationCount: 1,
    });
  }
  getEventStartDateWithSuffix(eventStartDate: Date): string {
    const date = new Date(eventStartDate).getDate();

    const ordinalSuffixes = ['th', 'st', 'nd', 'rd'];
    const lastDigit = date % 10;
    const suffix =
      lastDigit === 1 && date !== 11
        ? ordinalSuffixes[1]
        : lastDigit === 2 && date !== 12
        ? ordinalSuffixes[2]
        : lastDigit === 3 && date !== 13
        ? ordinalSuffixes[3]
        : ordinalSuffixes[0];

    return `${date}${suffix}`;
  }
  toggleDaySelection(day: string, i: number): void {
    const index = this.selectedCustomWeekDays.indexOf(day);
    console.log(typeof index);

    if (index === -1) {
      // Day is not in the selectedCustomWeekDays, so add it
      this.selectedCustomWeekDays.push(day);

      // Create a new FormGroup and push it to the recurrencePattern FormArray
      const recurrencePatternGroup = this.fb.group({
        dayOfWeek: day,
        dayOfMonth: null,
        weekOfMonth: null,
        monthOfYear: null,
      });
      this.recurrencePattern.push(recurrencePatternGroup);
    } else {
      // Day is in the selectedCustomWeekDays, so remove it
      this.selectedCustomWeekDays.splice(index, 1);

      // Find the corresponding recurrencePatternGroup with the same dayOfWeek and remove it
      const recurrencePatternIndex = this.recurrencePattern.controls.findIndex(
        (control) => control.get('dayOfWeek')?.value === day
      );
      if (recurrencePatternIndex !== -1) {
        this.recurrencePattern.removeAt(recurrencePatternIndex);
      }
    }

    console.log(this.recursiveEventForm.value);
    console.log('this.selectedCustomWeekDays', this.selectedCustomWeekDays);
  }

  applyWeekRecurrencePattern(recurrenceType: string) {
    this.recurrencePattern.clear();
    this.selectedCustomWeekDays = [];

    const index: any = this.eventStartDate.getDay();
    // console.log(typeof index);

    this.recursiveEventForm.patchValue({
      isRecurring: true,
      recurrenceTypeId: recurrenceType,
      separationCount: 1,
    });

    if (recurrenceType == 'week') {
      this.selectedOption = recurrenceType;
      this.selectedCustomWeekDays.push(index + 1);
      // console.log(this.selectedCustomWeekDays);
      const recurrencePatternGroup = this.fb.group({
        dayOfWeek: index + 1,
        dayOfMonth: null,
        weekOfMonth: null,
        monthOfYear: null,
      });
      this.recurrencePattern.push(recurrencePatternGroup);
    }
    this.showCustomRecusrsiveModal();
  }

  applyMonthRecurrencePattern(recurrenceType: string) {
    this.recurrencePattern.clear();

    this.selectedMonthlyRepeatOnOption = 'currentDay';

    this.recursiveEventForm.patchValue({
      isRecurring: true,
      recurrenceTypeId: recurrenceType,
      separationCount: 1,
    });
    if (recurrenceType == 'month') {
      this.selectedOption = recurrenceType;
      const today = new Date();
      console.log(today.getDay() + 1);
      this.addRecurrencePattern(
        this.eventStartDate.getDay() + 1,
        this.currentWeekOfMonth,
        null
      );
    }
    this.showCustomRecusrsiveModal();
  }

  applyCustomRecurrencePattern(recurrenceType: string) {
    this.recurrencePattern.clear();
    this.selectedOption = 'day';

    this.recursiveEventForm.patchValue({
      isRecurring: true,
      recurrenceTypeId: recurrenceType,
      separationCount: 1,
    });
    this.showCustomRecusrsiveModal();
  }

  onRepeatOnMonthlyOptionChange() {
    this.recurrencePattern.clear();
    console.log(this.selectedMonthlyRepeatOnOption);
    console.log(this.eventStartDate.getDate(), this.currentWeekOfMonth);

    if (this.selectedMonthlyRepeatOnOption === 'currentDate') {
      this.addRecurrencePattern(null, null, this.eventStartDate.getDate()); // Set dayOfMonth
    } else if (this.selectedMonthlyRepeatOnOption === 'currentDay') {
      console.log('dbchdfh');

      this.addRecurrencePattern(
        this.eventStartDate.getDay() + 1,
        this.currentWeekOfMonth,
        null
      ); // Set dayOfWeek
    }
  }

  // calculateCurrentDayAndOccurrence(): void {
  //   const today = new Date();
  //   this.currentDayOfWeek = today.toLocaleDateString('en-US', {
  //     weekday: 'long',
  //   });
  //   this.occurrenceInMonth = this.calculateOccurrenceInMonth(today);
  // }

  // calculateOccurrenceInMonth(date: Date): string {
  //   const dayOfWeek = date.getDay();
  //   const dayOfMonth = date.getDate();

  //   // Determine the week of the month
  //   const weekOfMonth = Math.ceil(dayOfMonth / 7);

  //   // Update the form with the week of the month and the day of the week
  //   this.addRecurrencePattern(dayOfWeek, weekOfMonth, null);

  //   return `${weekOfMonth}${this.getOrdinalSuffix(weekOfMonth)} ${
  //     this.currentDayOfWeek
  //   }`;
  // }

  // getOrdinalSuffix(n: number): string {
  //   const s = ['th', 'st', 'nd', 'rd'],
  //     v = n % 100;
  //   return s[(v - 20) % 10] || s[v] || s[0];
  // }

  handleCustomRecursiveRequestSubmit(): void {
    console.log('Button ok clicked!');
    // this.isVisibleCustomPopup = false;
    console.log(this.recursiveEventForm.value);

    if (this.recursiveEventForm.valid) {
      this.recurrenceDescription =
        this.recurrenceService.getRecurrenceDescription(
          this.recursiveEventForm.value
        );
      console.log('this.recurrenceDescription-->', this.recurrenceDescription);
      this.isVisibleCustomPopup = false;
    } else {
      this.recursiveEventForm.markAllAsTouched();
    }
  }

  handleCustomRecursiveRequestCancel(): void {
    this.selectedCustomWeekDays = [];
    console.log('Button cancel clicked!');
    this.isVisibleCustomPopup = false;
  }
  addRecurrencePattern(
    dayOfWeek: number | null,
    weekOfMonth: number | null,
    dayOfMonth: number | null
  ): void {
    const recurrencePatternGroup = this.fb.group({
      dayOfWeek: dayOfWeek,
      dayOfMonth: dayOfMonth,
      weekOfMonth: weekOfMonth,
      monthOfYear: null,
    });
    this.recurrencePattern.push(recurrencePatternGroup);
    console.log(this.recursiveEventForm.value);
  }

  // --------------Final submit  Event form---------------------------------------
  submitForm() {
    let recursiveSeparationCount =
      this.recursiveEventForm.value.separationCount;
    console.log(recursiveSeparationCount);

    let startDate = this.eventForm.value.startDate;

    this.eventForm.patchValue({
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
    });
    if (recursiveSeparationCount == 0) {
      this.recurrenceDescription = '';
      this.recurrencePattern.clear();
      this.recursiveEventForm.patchValue({
        isRecurring: false,
        recurrenceTypeId: null,
        separationCount: 0,
        recurrenceEndDate: null,
      });
    }

    let createEventData = this.eventForm.value;
    let recursiveEventData = this.recursiveEventForm.value;
    const createFinalEventData = {
      ...this.eventForm.value,
      ...this.recursiveEventForm.value,
    };
    console.log('evnet form Value-->', createFinalEventData);
   

    this.eventTaskService.createEvent(createFinalEventData).subscribe({
      next: (res: any) => {
        console.log('createEvent-->', res);
      },
      error: (error) => {
        console.error('Error creating event:', error);
        // this.onSubmitError.emit('Failed to create recursive event.');
      },
    });
  }

  createEventInstance() {
    let payload = this.eventForm.value;
    console.log(payload);

    this.eventTaskService.createEvent(payload).subscribe({
      next: (res: any) => {
        console.log('createEventInstance res-->', res);
        this.eventTaskService.notifyEventCreated();
        this.submitEvent.emit();
      },
      error: (error) => {
        console.error('Error creating event instance:', error);
        // this.onSubmitError.emit('Failed to create event instance.');
      },
    });
  }
  cancel() {
    this.submitEvent.emit();
  }
}

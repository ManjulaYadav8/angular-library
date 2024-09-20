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

import { NzUploadListType } from 'ng-zorro-antd/upload';
import moment from 'moment';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CreateTaskComponent {
  @Output() submitEvent = new EventEmitter<void>();

  taskForm: FormGroup;

  // eventTaskAssigneeDetails  variables
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
      user_id: '1',
      user_name: 'User A',
    },
    {
      user_id: '2',
      user_name: 'User B',
    },
    {
      user_id: '3',
      user_name: 'User C',
    },
    {
      user_id: '4',
      user_name: 'User D',
    },
    {
      user_id: '5',
      user_name: 'User E',
    },
  ];

  //eventTaskReminderDetails details

  reminderUOMList: any = ['hours', 'minutes', 'days', 'weeks'];
  selectedInterval: number = 0;
  selectedUOM: string = '';
  reminderIntervalMaxValue: number = 10000;
  reminderIntervalMinValue: number = 1;

  taskStartTime: any;
  taskEndTime: any;
  taskStartDate: Date = new Date();
  taskEndDate: Date = new Date();

  isAlldayTask: boolean = false;
  isHighPriorityTask: boolean = false;

  todaysDate: Date = new Date();

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
  timeOptions: string[] = [];
  timeOptionsStart: string[] = [];
  timeOptionsEnd: string[] = [];
  isEndLEStartTime: boolean = false;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private eventTaskService: EventTaskService
  ) {
    this.taskForm = this.fb.group({
      userId: [1], // for userId
      eventTaskTypeId:
        this.eventTaskService.getTaskTypeLookupIdByValue('Custom Tasks'), // for eventId
      isTask: [true],
      isRecurring: [false],
      isAllDayEvent: [false],
      isHighPriority: [false],
      recurrenceTypeId: ['none'],
      separationCount: [0],
      maxOccurences: [null],
      recurrencePattern: [null],
      recurrenceEndDate: [null],
      title: [null, [Validators.required]], // for title
      description: [null, [Validators.required]], // for description
      startDate: [this.todaysDate, [Validators.required]],
      // subject: ['Test Subject'],
      endDate: [this.todaysDate, [Validators.required]],
      startTime: [{ value: null, disabled: false }],
      endTime: [{ value: null, disabled: false }], // for endTime (time only)
      timezone: ['(GMT+05:30) Indian Standard Time'], // for timezone
      eventTaskAssigneeDetails: this.fb.array([this.createAssigneeDetail()]), // Initialize with one assignee detail
      eventTaskReminderDetails: this.fb.array([this.createReminderDetails()]),
    });
  }

  ngOnInit() {
    console.log(
      this.eventTaskService.getTaskTypeLookupIdByValue('Custom Tasks')
    );
    console.log('create task modal component');
    // this.generateTimeOptions();
    this.setDefaultTimes();
  }

  ///-----------------------------------task start time and end time Detail----------------------------
  setDefaultTimes(): void {
    const currentTime = new Date();

    // Get the current hour and round up to the next hour
    const startTime = new Date();
    startTime.setHours(currentTime.getHours() + 1, 0, 0, 0); // Round to the next hour

    // Set the end time to one hour after the start time
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // Add one hour

    this.taskStartTime = startTime;
    this.taskEndTime = endTime;

    this.taskForm.patchValue({
      startTime: this.converttoLocaleTimeString(this.taskStartTime),
      endTime: this.converttoLocaleTimeString(this.taskEndTime),
    });
  }

  // setDefaultTimes(): void {
  //   const currentTime = moment();

  //   // Round to the next hour for start time
  //   const startTime = currentTime.clone().add(1, 'hours').startOf('hour'); // Next full hour

  //   // Set the end time to one hour after the start time
  //   const endTime = startTime.clone().add(1, 'hours'); // One hour after start time

  //   // Format the times in 12-hour format (h:mm A)
  //   this.taskStartTime = startTime.format('hh:mm A'); // Example: 07:00 AM
  //   this.taskEndTime = endTime.format('hh:mm A'); // Example: 05:00 PM
  //   console.log(this.taskStartTime, this.taskEndTime);
  //   this.startTimeLog(this.taskStartTime);

  //   this.taskForm.patchValue({
  //     startTime: this.convertTo24HourFormat(this.taskStartTime),
  //     endTime: this.convertTo24HourFormat(this.taskEndTime),
  //   });
  // }
  // generateTimeOptions(): void {
  //   const startTime = moment().startOf('day'); // Start at 12:00 AM
  //   const endOfDay = moment().endOf('day'); // End at 11:59 PM

  //   const startTimeCopy = startTime.clone(); // Make a copy for the endTime generation

  //   // Generate start time options from 12:00 AM to 11:45 PM
  //   while (startTime.isBefore(endOfDay)) {
  //     this.timeOptionsStart.push(startTime.format('hh:mm A'));
  //     startTime.add(15, 'minutes');
  //   }

  //   // Generate end time options from 12:15 AM onwards (always later than start time)
  //   while (startTimeCopy.add(15, 'minutes').isBefore(endOfDay)) {
  //     this.timeOptionsEnd.push(startTimeCopy.format('hh:mm A'));
  //   }
  // }
  // convertTo24HourFormat(time12h: string): string {
  //   return moment(time12h, 'hh:mm A').format('HH:mm:ss');
  // }
  // startTimeLog(value: any): void {
  //   console.log(value);

  //   if (value != null) {
  //     // Set the task start time
  //     this.isEndBeforeOrEqualToStart();
  //     console.log(
  //       'isEndBeforeOrEqualToStart',
  //       this.isEndBeforeOrEqualToStart()
  //     );
  //     this.taskStartTime = value;

  //     const timeString = this.convertTo24HourFormat(this.taskStartTime); // Format the start time as 'HH:mm:ss'
  //     console.log(timeString);
  //     this.taskForm.patchValue({
  //       startTime: timeString,
  //     });
  //   }
  // }

  // endTimeLog(value: Date): void {
  //   if (value != null) {
  //     this.taskEndTime = value;
  //     this.isEndBeforeOrEqualToStart();
  //     console.log(
  //       'isEndBeforeOrEqualToStart',
  //       this.isEndBeforeOrEqualToStart()
  //     );
  //     const timeString = this.convertTo24HourFormat(this.taskEndTime); // Format the start time as 'HH:mm:ss'
  //     console.log(timeString);

  //     this.taskForm.patchValue({
  //       endTime: timeString,
  //     });
  //   }
  // }

  // isEndBeforeOrEqualToStart() {
  //   // Parse the times using moment with the 12-hour format (hh:mm A)
  //   const start = moment(this.taskStartTime, 'hh:mm A');
  //   const end = moment(this.taskEndTime, 'hh:mm A');
  //   // Compare the two times and return true if the end time is lesser;
  //   this.isEndLEStartTime = end.isSameOrBefore(start);
  //   if (this.isEndLEStartTime) {
  //     // Parse the taskStartDate and add one day to get the next day
  //     const startDate = moment(this.taskStartDate);
  //     this.taskEndDate = new Date(
  //       startDate.add(1, 'days').format('YYYY-MM-DD')
  //     ); // or your preferred date format
  //   }

  //   this.taskForm.patchValue({
  //     startDate: this.taskStartDate,
  //     endDate: this.taskEndDate,
  //   });
  //   return end.isSameOrBefore(start);
  // }

  converttoLocaleTimeString(time: any) {
    const date = new Date(time);
    const timeString = date.toLocaleTimeString('en-GB'); // Format the start time as 'HH:mm:ss'
    console.log(timeString);
    return timeString;
  }

  startTimeLog(value: any): void {
    console.log(value);

    if (value != null) {
      // Set the task start time
      this.taskStartTime = value;

      const date = new Date(this.taskStartTime);
      const timeString = date.toLocaleTimeString('en-GB'); // Format the start time as 'HH:mm:ss'
      console.log(timeString);

      // Check if taskEndTime exists and is before or equal to taskStartTime
      if (this.taskEndTime && this.taskEndTime <= this.taskStartTime) {
        // Reset end time to be 1 hour after the start time
        const endTime = new Date(this.taskStartTime);
        endTime.setHours(endTime.getHours() + 1); // Add 1 hour to start time
        this.taskEndTime = endTime;
      }

      // Update the form with the new start time and ensure taskEndTime is correctly set
      this.taskForm.patchValue({
        startTime: timeString,
        endTime: this.taskEndTime
          ? this.taskEndTime.toLocaleTimeString('en-GB')
          : null,
      });
    }
    // else {
    //   // If value is null, reset both times
    //   this.taskForm.patchValue({
    //     startTime: null,
    //     endTime: null,
    //   });
    //   this.taskEndTime = null;
    //   this.taskStartTime = null;
    // }
  }

  endTimeLog(value: Date): void {
    if (value != null) {
      const date = new Date(this.taskEndTime);
      const timeString = date.toLocaleTimeString('en-GB'); // Use 'en-GB' or another locale to get 'HH:mm:ss' format
      console.log(timeString);

      this.taskForm.patchValue({
        endTime: timeString,
      });
    }
    // else {
    //   this.taskEndTime = null;
    //   this.taskStartTime = null;
    //   this.taskForm.patchValue({
    //     startTime: null,
    //     endTime: null,
    //   });
    // }
  }

  disabledEndHours = (): number[] => {
    if (!this.taskStartTime) {
      return [];
    }
    const startHour = this.taskStartTime.getHours();
    return Array.from({ length: startHour }, (_, i) => i); // Disable hours less than the start hour
  };

  disabledEndMinutes = (hour: number): number[] => {
    if (!this.taskStartTime || hour > this.taskStartTime.getHours()) {
      return [];
    }
    if (hour === this.taskStartTime.getHours()) {
      const startMinute = this.taskStartTime.getMinutes();
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
  taskStartDateClick(value: Date) {
    console.log('taskStartDateClick-->', new Date(value));

    this.taskForm.patchValue({
      startDate: value,
    });

    if (!this.isAlldayTask) {
      this.taskForm.patchValue({
        endDate: value,
      });
      this.taskEndDate = value;
    }
  }
  taskEndDateClick(value: Date) {
    console.log('taskEndDateClick-->', new Date(value));

    this.taskForm.patchValue({
      endDate: value,
    });
  }
  isAlldayTaskCheckbox() {
    console.log(this.isAlldayTask);

    if (this.isAlldayTask) {
      this.taskForm.patchValue({
        isAllDayEvent: this.isAlldayTask,
        startTime: null,
        endTime: null,
      });
      this.taskForm.get('startTime')?.disable();
      this.taskForm.get('endTime')?.disable();
    } else {
      this.taskForm.patchValue({
        isAllDayEvent: false,
        startTime: this.taskStartTime,
        endTime: this.taskEndTime,
      });
      this.taskForm.get('startTime')?.enable();
      this.taskForm.get('endTime')?.enable();
    }
    // this.taskStartTime = null;
    // this.taskEndTime = null;
    // this.taskForm.patchValue({
    //   startTime: null,
    //   endTime: null,
    // });
  }
  ///-----------------------------------createAssigneeDetail----------------------------

  get eventTaskAssigneeDetails() {
    return this.taskForm.get('eventTaskAssigneeDetails') as FormArray;
  }

  createAssigneeDetail(): FormGroup {
    return this.fb.group({
      level: '1',
      company: [null],
      department: [null],
      users: [[]], // Initialize an empty FormArray for users
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

  // onCompanySelect(selectedCompany: any, index: number) {
  //   console.log('hdbhbfdf', selectedCompany);
  //   const assigneeGroup = this.eventTaskAssigneeDetails.at(index);

  //   if (assigneeGroup) {
  //     assigneeGroup.patchValue({ company: selectedCompany });
  //   }
  // }

  // onDepartmentSelect(department: any, index: number) {
  //   const assigneeGroup = this.eventTaskAssigneeDetails.at(index);
  //   assigneeGroup.patchValue({ department: department });
  // }

  // onUserSelect(users: any[], index: number) {
  //   const assigneeGroup = this.eventTaskAssigneeDetails.at(index) as FormGroup;
  //   const usersArray = assigneeGroup.get('users') as FormArray;

  //   // Clear the current users
  //   usersArray.clear();

  //   // Add the selected users
  //   users.forEach((user) => {
  //     usersArray.push(
  //       this.fb.group({
  //         user_id: user.id,
  //         user_name: user.name,
  //       })
  //     );
  //   });
  // }

  addAssigneeDetail() {
    this.eventTaskAssigneeDetails.push(this.createAssigneeDetail());
  }
  removeAssigneeDetails(index: any) {
    if (this.eventTaskAssigneeDetails.length > 1) {
      this.eventTaskAssigneeDetails.removeAt(index);
    }
  }

  //------------------------create eventTaskReminderDetails ----------------------------

  get eventTaskReminderDetails(): FormArray {
    return this.taskForm.get('eventTaskReminderDetails') as FormArray;
  }

  createReminderDetails(): FormGroup {
    return this.fb.group({
      reminderInterval: [10],
      reminderUOM: ['minutes'],
    });
  }

  onReminderIntervalSelect(timeInterval: any, index: number) {
    console.log(timeInterval);

    const remindersGroup = this.eventTaskReminderDetails.at(index);

    if (timeInterval) {
      this.selectedInterval = 1;
      remindersGroup.patchValue({ reminderInterval: timeInterval });
    }
  }

  onReminderUomSelect(uom: string, index: number) {
    const remindersGroup = this.eventTaskReminderDetails.at(index);
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
    this.eventTaskReminderDetails.push(
      this.fb.group({
        reminderInterval: [10],
        reminderUOM: ['minutes'],
      })
    );
    console.log(this.eventTaskReminderDetails);
  }

  removeReminder(index: number): void {
    if (this.eventTaskReminderDetails.length > 1) {
      this.eventTaskReminderDetails.removeAt(index);
    }
  }

  // --------------Final submit Task form---------------------------------------
  submitForm() {
    let startDate = this.taskForm.value.startDate;
    let endDate = this.taskForm.value.endDate;

    this.taskForm.patchValue({
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd'),
    });

    let createTaskData = this.taskForm.value;

    console.log('evnet form Value-->', createTaskData);

    this.eventTaskService.createEvent(createTaskData).subscribe({
      next: (res: any) => {
        console.log('createTask-->', res);
        this.eventTaskService.notifyEventCreated();
        this.submitEvent.emit();
      },
      error: (error) => {
        console.error('Error creating event:', error);
        // this.onSubmitError.emit('Failed to create recursive event.');
      },
    });
  }

  cancel() {
    this.submitEvent.emit();
  }
}

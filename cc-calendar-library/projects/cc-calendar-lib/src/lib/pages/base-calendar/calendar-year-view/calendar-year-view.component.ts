import { Component, Input, OnInit } from '@angular/core';
import { startOfMonth, addMonths } from 'date-fns';

@Component({
  selector: 'app-calendar-year-view',
  templateUrl: './calendar-year-view.component.html',
  styleUrl: './calendar-year-view.component.scss',
})
export class CalendarYearViewComponent {
  @Input() year: number = new Date().getFullYear();
  months: number[] = Array.from({ length: 12 }, (_, i) => i);
  monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor() {}

  ngOnInit(): void {}

  getMonthStartDate(month: number): Date {
    return startOfMonth(new Date(this.year, month));
  }

  onDateSelect(selectedDate: Date): void {
    console.log('Date selected:', selectedDate);
    // Handle date selection (e.g., open a popup with events)
  }
}

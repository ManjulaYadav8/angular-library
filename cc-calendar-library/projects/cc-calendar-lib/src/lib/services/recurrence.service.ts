import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecurrenceService {
  private daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  private weekNumbers = ['1st', '2nd', '3rd', '4th', '5th'];

  getRecurrenceDescription(recurrenceData: any): string {
    const { recurrenceTypeId, separationCount, recurrencePattern } =
      recurrenceData;

    switch (recurrenceTypeId.toLowerCase()) {
      case 'day':
        return this.getDailyRecurrenceDescription(separationCount);
      case 'week':
        return this.getWeeklyRecurrenceDescription(
          separationCount,
          recurrencePattern
        );
      case 'month':
        return this.getMonthlyRecurrenceDescription(
          separationCount,
          recurrencePattern
        );
      case 'year':
        return this.getYearlyRecurrenceDescription(recurrencePattern);
      default:
        return 'Unsupported recurrence type';
    }
  }

  private getDailyRecurrenceDescription(separationCount: number): string {
    return `Every ${separationCount > 1 ? separationCount : ''} day${
      separationCount > 1 ? 's' : ''
    }`;
  }

  private getWeeklyRecurrenceDescription(
    separationCount: number,
    recurrencePattern: any[]
  ): string {
    const days = recurrencePattern.map(
      (pattern) => this.daysOfWeek[pattern.dayOfWeek - 1]
    );
    return `Every ${separationCount > 1 ? separationCount : ''} week${
      separationCount > 1 ? 's' : ''
    } on ${days.join(' and ')}`;
  }

  private getMonthlyRecurrenceDescription(
    separationCount: number,
    recurrencePattern: any[]
  ): string {
    if (recurrencePattern.length === 0) {
      return `Every ${separationCount > 1 ? separationCount : ''} month${
        separationCount > 1 ? 's' : ''
      } without a specific day`;
    }

    const pattern = recurrencePattern[0];

    if (pattern.dayOfMonth !== null) {
      return `Every ${separationCount > 1 ? separationCount : ''} month${
        separationCount > 1 ? 's' : ''
      } on the ${pattern.dayOfMonth}${this.getDaySuffix(
        pattern.dayOfMonth
      )} day`;
    } else if (pattern.weekOfMonth !== null && pattern.dayOfWeek !== null) {
      const weekOfMonth = this.weekNumbers[pattern.weekOfMonth - 1];
      const dayOfWeek = this.daysOfWeek[pattern.dayOfWeek - 1];
      return `Every ${separationCount > 1 ? separationCount : ''} month${
        separationCount > 1 ? 's' : ''
      } on the ${weekOfMonth} ${dayOfWeek}`;
    }

    return `Every ${separationCount > 1 ? separationCount : ''} month${
      separationCount > 1 ? 's' : ''
    } with an unsupported pattern`;
  }

  private getYearlyRecurrenceDescription(recurrencePattern: any[]): string {
    if (recurrencePattern.length === 0) {
      return 'Yearly recurrence without a specific day';
    }

    const pattern = recurrencePattern[0];

    if (pattern.dayOfMonth !== null && pattern.monthOfYear !== null) {
      return `Annually on ${this.getMonthName(pattern.monthOfYear)} ${
        pattern.dayOfMonth
      }${this.getDaySuffix(pattern.dayOfMonth)}`;
    }

    return 'Yearly recurrence with an unsupported pattern';
  }

  private getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  private getMonthName(monthIndex: number): string {
    const months = [
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
    return months[monthIndex - 1];
  }

  getCurrentOccurrenceOfEventStartDay(date: Date): object {
    const targetDate = new Date(date);
    const currentDayIndex = targetDate.getDay(); // Index of the current day (0 for Sunday, 1 for Monday, etc.)
    const currentDay = this.daysOfWeek[currentDayIndex]; // Get the name of the current day
    let currentWeekOfMonth;
    let occurrenceInMonth;

    const totalDaysInMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    ).getDate(); // Total days in the month
    const lastWeekStart = totalDaysInMonth - 6; // Start of the last week in the month
    const dayOfMonth = targetDate.getDate(); // Day of the month from the passed date

    // Calculate the occurrence of the current day within the month up to the target date
    let occurrence = 0;
    for (let i = 1; i <= dayOfMonth; i++) {
      const tempDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        i
      );
      if (tempDate.getDay() === currentDayIndex) {
        occurrence++;
        currentWeekOfMonth = occurrence;
      }
    }

    // Check if the target date is in the last week of the month

    // Convert occurrence number to word (first, second, third, fourth)
    const wordOccurrences = ['first', 'second', 'third', 'fourth'];
    let ordinalOccurrence = wordOccurrences[occurrence - 1]; // Adjust to 0-indexed array

    if (
      dayOfMonth >= lastWeekStart &&
      targetDate.getDay() === currentDayIndex
    ) {
      // occurrenceInMonth = `last ${currentDay}`;
      ordinalOccurrence = 'last';
      currentWeekOfMonth = 4;
    }

    // this.occurrenceInMonth = `${ordinalOccurrence} ${currentDay}`;
    let result = {
      currentWeekOfMonth: currentWeekOfMonth,
      ordinalOccurrence: ordinalOccurrence,
      currentDay: currentDay,
    };

    return result;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventTaskService {
  constructor(private http: HttpClient) {}

  private eventCreatedSource = new Subject<void>();
  eventCreated$ = this.eventCreatedSource.asObservable();

  notifyEventCreated(data?: any) {
    this.eventCreatedSource.next(data || null);
  }

  storeDataOnLocalStorage(key: any, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  getDataFromLocalStorage(key: string) {
    // Check if data exists in local storage and return it; otherwise, return null or default value
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  getEventsTasksInfo(params?: any) {
    // let params = new HttpParams().set('lookup_type', lookup_type);
    return this.http.get('/eventTask/getEventTaskInfo', { params });
  }
  putEventsTasksInfo(body?: any) {
    // let params = new HttpParams().set('lookup_type', lookup_type);
    return this.http.put('/eventTask/editEventTask', body);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post('/eventTask/createEventTask', eventData);
  }

  createRecursiveEvent(eventData: any): Observable<any> {
    return this.http.post('/event/createEvent', eventData);
  }

  getEventTypes(lookup_type: string) {
    let params = new HttpParams().set('lookup_type', lookup_type);
    return this.http.get<any[]>('/lookup/getLookup', { params });
  }

  getEventTypeLookupIdByValue(lookupValue: string): string | null {
    // Retrieve the event types from local storage
    const eventTypes = JSON.parse(localStorage.getItem('event-types') || '[]');

    // Find the event type object where lookup_value matches the provided value
    const eventType = eventTypes.find(
      (event: any) => event.lookup_value === lookupValue
    );

    // Return the lookup_id if found, otherwise return null
    return eventType ? eventType.lookup_id : null;
  }
  getTaskTypeLookupIdByValue(lookupValue: string): string | null {
    // Retrieve the event types from local storage
    const eventTypes = JSON.parse(localStorage.getItem('task-types') || '[]');

    // Find the event type object where lookup_value matches the provided value
    const eventType = eventTypes.find(
      (event: any) => event.lookup_value === lookupValue
    );

    // Return the lookup_id if found, otherwise return null
    return eventType ? eventType.lookup_id : null;
  }
  getTaskStatusLookupIdByValue(lookupValue: string): string | null {
    // Retrieve the event types from local storage
    const taskStatus = JSON.parse(localStorage.getItem('task-status') || '[]');

    // Find the event type object where lookup_value matches the provided value
    const status = taskStatus.find(
      (event: any) => event.lookup_value === lookupValue
    );

    // Return the lookup_id if found, otherwise return null
    return status ? status.lookup_id : null;
  }
  getTaskStatusLookupValueById(lookupId: string): string | null {
    // Retrieve the event types from local storage
    const taskStatus = JSON.parse(localStorage.getItem('task-status') || '[]');

    // Find the event type object where lookup_value matches the provided value
    const status = taskStatus.find((event: any) => event.lookupId === lookupId);

    // Return the lookup_id if found, otherwise return null
    return status ? status.lookup_value : null;
  }

  //CREATE Setting API
  createUserSetting(settingsData: any): Observable<any> {
    // return this.http.post('/settings/createSettings', settingsData);
    return this.http.post('/settings/upsertSettings', settingsData);
  }

  // GET SETTING API
  getUserSetting(params?: any) {
    console.log('user-setting-param', params);
    return this.http.get('/settings/getSettingsInfo', { params });
  }
}

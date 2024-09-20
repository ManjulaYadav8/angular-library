import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
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

  getEvents(params?: any) {
    // let params = new HttpParams().set('lookup_type', lookup_type);
    return this.http.get('/eventTask/getEventTaskInfo', { params });
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

  getLookupIdByValue(lookupValue: string): string | null {
   
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

}

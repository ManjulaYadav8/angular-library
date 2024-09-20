import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCalendarComponent } from './base-calendar.component';

describe('BaseCalendarComponent', () => {
  let component: BaseCalendarComponent;
  let fixture: ComponentFixture<BaseCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

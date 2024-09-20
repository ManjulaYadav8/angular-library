import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneSettingsComponent } from './timezone-settings.component';

describe('TimezoneSettingsComponent', () => {
  let component: TimezoneSettingsComponent;
  let fixture: ComponentFixture<TimezoneSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimezoneSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimezoneSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

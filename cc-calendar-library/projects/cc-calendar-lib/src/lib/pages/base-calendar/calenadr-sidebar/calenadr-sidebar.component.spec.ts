import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenadrSidebarComponent } from './calenadr-sidebar.component';

describe('CalenadrSidebarComponent', () => {
  let component: CalenadrSidebarComponent;
  let fixture: ComponentFixture<CalenadrSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalenadrSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalenadrSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

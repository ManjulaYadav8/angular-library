import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSettingsComponent } from './base-settings.component';

describe('BaseSettingsComponent', () => {
  let component: BaseSettingsComponent;
  let fixture: ComponentFixture<BaseSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

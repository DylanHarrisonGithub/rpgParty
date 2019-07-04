import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchpadComponent } from './touchpad.component';

describe('TouchpadComponent', () => {
  let component: TouchpadComponent;
  let fixture: ComponentFixture<TouchpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouchpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

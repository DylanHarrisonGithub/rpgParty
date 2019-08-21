import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QeActorPickerComponent } from './qe-actor-picker.component';

describe('QeActorPickerComponent', () => {
  let component: QeActorPickerComponent;
  let fixture: ComponentFixture<QeActorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QeActorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QeActorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

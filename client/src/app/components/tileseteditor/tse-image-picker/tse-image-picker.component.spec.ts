import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TseImagePickerComponent } from './tse-image-picker.component';

describe('TseImagePickerComponent', () => {
  let component: TseImagePickerComponent;
  let fixture: ComponentFixture<TseImagePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TseImagePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TseImagePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

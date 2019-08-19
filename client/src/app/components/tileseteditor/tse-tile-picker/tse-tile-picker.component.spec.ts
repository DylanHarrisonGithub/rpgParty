import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TseTilePickerComponent } from './tse-tile-picker.component';

describe('TseTilePickerComponent', () => {
  let component: TseTilePickerComponent;
  let fixture: ComponentFixture<TseTilePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TseTilePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TseTilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolpickerComponent } from './toolpicker.component';

describe('ToolpickerComponent', () => {
  let component: ToolpickerComponent;
  let fixture: ComponentFixture<ToolpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

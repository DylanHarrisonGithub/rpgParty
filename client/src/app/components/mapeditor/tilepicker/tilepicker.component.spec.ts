import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilepickerComponent } from './tilepicker.component';

describe('TilepickerComponent', () => {
  let component: TilepickerComponent;
  let fixture: ComponentFixture<TilepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

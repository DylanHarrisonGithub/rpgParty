import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesteditorComponent } from './questeditor.component';

describe('QuesteditorComponent', () => {
  let component: QuesteditorComponent;
  let fixture: ComponentFixture<QuesteditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuesteditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapeditorComponent } from './mapeditor.component';

describe('MapeditorComponent', () => {
  let component: MapeditorComponent;
  let fixture: ComponentFixture<MapeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

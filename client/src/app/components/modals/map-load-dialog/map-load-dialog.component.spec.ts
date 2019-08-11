import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLoadDialogComponent } from './map-load-dialog.component';

describe('MapLoadDialogComponent', () => {
  let component: MapLoadDialogComponent;
  let fixture: ComponentFixture<MapLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

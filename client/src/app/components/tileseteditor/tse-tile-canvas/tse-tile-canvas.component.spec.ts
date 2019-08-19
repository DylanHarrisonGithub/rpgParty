import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TseTileCanvasComponent } from './tse-tile-canvas.component';

describe('TseTileCanvasComponent', () => {
  let component: TseTileCanvasComponent;
  let fixture: ComponentFixture<TseTileCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TseTileCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TseTileCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

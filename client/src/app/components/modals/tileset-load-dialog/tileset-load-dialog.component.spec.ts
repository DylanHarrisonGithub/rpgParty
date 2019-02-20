import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesetLoadDialogComponent } from './tileset-load-dialog.component';

describe('TilesetLoadDialogComponent', () => {
  let component: TilesetLoadDialogComponent;
  let fixture: ComponentFixture<TilesetLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilesetLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesetLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

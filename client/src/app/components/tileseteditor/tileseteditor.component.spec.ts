import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileseteditorComponent } from './tileseteditor.component';

describe('TileseteditorComponent', () => {
  let component: TileseteditorComponent;
  let fixture: ComponentFixture<TileseteditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileseteditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileseteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BkgCrossfaderComponent } from './bkg-crossfader.component';

describe('BkgCrossfaderComponent', () => {
  let component: BkgCrossfaderComponent;
  let fixture: ComponentFixture<BkgCrossfaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BkgCrossfaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BkgCrossfaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

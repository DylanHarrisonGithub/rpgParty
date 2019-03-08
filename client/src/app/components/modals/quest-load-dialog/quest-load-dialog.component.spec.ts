import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestLoadDialogComponent } from './quest-load-dialog.component';

describe('QuestLoadDialogComponent', () => {
  let component: QuestLoadDialogComponent;
  let fixture: ComponentFixture<QuestLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

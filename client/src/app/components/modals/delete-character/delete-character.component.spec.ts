import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCharacterComponent } from './delete-character.component';

describe('DeleteCharacterComponent', () => {
  let component: DeleteCharacterComponent;
  let fixture: ComponentFixture<DeleteCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCharacterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

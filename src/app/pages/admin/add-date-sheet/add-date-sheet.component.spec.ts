import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDateSheetComponent } from './add-date-sheet.component';

describe('AddDateSheetComponent', () => {
  let component: AddDateSheetComponent;
  let fixture: ComponentFixture<AddDateSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDateSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDateSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

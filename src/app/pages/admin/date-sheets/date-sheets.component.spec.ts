import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSheetsComponent } from './date-sheets.component';

describe('DateSheetsComponent', () => {
  let component: DateSheetsComponent;
  let fixture: ComponentFixture<DateSheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateSheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelPaperComponent } from './add-model-paper.component';

describe('AddModelPaperComponent', () => {
  let component: AddModelPaperComponent;
  let fixture: ComponentFixture<AddModelPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModelPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModelPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

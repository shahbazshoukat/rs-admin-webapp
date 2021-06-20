import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPapersComponent } from './model-papers.component';

describe('ModelPapersComponent', () => {
  let component: ModelPapersComponent;
  let fixture: ComponentFixture<ModelPapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPapersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

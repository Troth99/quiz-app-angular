import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuiz } from './edit-quiz';

describe('EditQuiz', () => {
  let component: EditQuiz;
  let fixture: ComponentFixture<EditQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

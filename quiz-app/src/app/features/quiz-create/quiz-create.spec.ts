import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreate } from './quiz-create';

describe('QuizCreate', () => {
  let component: QuizCreate;
  let fixture: ComponentFixture<QuizCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

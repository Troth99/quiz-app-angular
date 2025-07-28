import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCategory } from './quiz-category';

describe('QuizCategory', () => {
  let component: QuizCategory;
  let fixture: ComponentFixture<QuizCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

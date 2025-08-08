import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResolver } from './quiz-resolver';

describe('QuizResolver', () => {
  let component: QuizResolver;
  let fixture: ComponentFixture<QuizResolver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizResolver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizResolver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizBugReport } from './quiz-bug-report';

describe('QuizBugReport', () => {
  let component: QuizBugReport;
  let fixture: ComponentFixture<QuizBugReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizBugReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizBugReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

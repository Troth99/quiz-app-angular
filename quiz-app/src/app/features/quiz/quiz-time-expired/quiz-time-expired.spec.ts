import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTimeExpired } from './quiz-time-expired';

describe('QuizTimeExpired', () => {
  let component: QuizTimeExpired;
  let fixture: ComponentFixture<QuizTimeExpired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizTimeExpired]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizTimeExpired);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

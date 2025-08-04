import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPlayer } from './quiz-player';

describe('QuizPlayer', () => {
  let component: QuizPlayer;
  let fixture: ComponentFixture<QuizPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

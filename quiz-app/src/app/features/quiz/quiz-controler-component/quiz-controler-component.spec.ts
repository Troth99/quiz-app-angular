import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizControlerComponent } from './quiz-controler-component';

describe('QuizControlerComponent', () => {
  let component: QuizControlerComponent;
  let fixture: ComponentFixture<QuizControlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizControlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizControlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

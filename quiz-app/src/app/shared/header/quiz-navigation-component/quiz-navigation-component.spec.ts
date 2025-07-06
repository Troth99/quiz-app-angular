import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizNavigationComponent } from './quiz-navigation-component';

describe('QuizNavigationComponent', () => {
  let component: QuizNavigationComponent;
  let fixture: ComponentFixture<QuizNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

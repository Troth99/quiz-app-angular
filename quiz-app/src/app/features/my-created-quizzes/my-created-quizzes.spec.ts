import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCreatedQuizzes } from './my-created-quizzes';

describe('MyCreatedQuizzes', () => {
  let component: MyCreatedQuizzes;
  let fixture: ComponentFixture<MyCreatedQuizzes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCreatedQuizzes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCreatedQuizzes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

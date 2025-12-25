import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementToastNotification } from './achievement-toast-notification';

describe('AchievementToastNotification', () => {
  let component: AchievementToastNotification;
  let fixture: ComponentFixture<AchievementToastNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementToastNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementToastNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDisplayName } from './change-display-name';

describe('ChangeDisplayName', () => {
  let component: ChangeDisplayName;
  let fixture: ComponentFixture<ChangeDisplayName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeDisplayName]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeDisplayName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

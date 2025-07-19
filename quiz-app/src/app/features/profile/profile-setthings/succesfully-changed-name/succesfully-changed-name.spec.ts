import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesfullyChangedName } from './succesfully-changed-name';

describe('SuccesfullyChangedName', () => {
  let component: SuccesfullyChangedName;
  let fixture: ComponentFixture<SuccesfullyChangedName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccesfullyChangedName]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccesfullyChangedName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

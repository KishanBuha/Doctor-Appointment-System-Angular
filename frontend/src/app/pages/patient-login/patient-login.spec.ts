import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLogin } from './patient-login';

describe('PatientLogin', () => {
  let component: PatientLogin;
  let fixture: ComponentFixture<PatientLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRegister } from './doctor-register';

describe('DoctorRegister', () => {
  let component: DoctorRegister;
  let fixture: ComponentFixture<DoctorRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

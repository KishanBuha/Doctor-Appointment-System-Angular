import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointments } from './doctor-appointments';

describe('DoctorAppointments', () => {
  let component: DoctorAppointments;
  let fixture: ComponentFixture<DoctorAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

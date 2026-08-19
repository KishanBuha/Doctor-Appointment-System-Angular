import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSchedule } from './doctor-schedule';

describe('DoctorSchedule', () => {
  let component: DoctorSchedule;
  let fixture: ComponentFixture<DoctorSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

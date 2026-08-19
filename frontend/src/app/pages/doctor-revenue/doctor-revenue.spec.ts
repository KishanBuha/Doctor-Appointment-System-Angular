import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRevenue } from './doctor-revenue';

describe('DoctorRevenue', () => {
  let component: DoctorRevenue;
  let fixture: ComponentFixture<DoctorRevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorRevenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorRevenue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

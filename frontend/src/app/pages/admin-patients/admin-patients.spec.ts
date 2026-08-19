import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatients } from './admin-patients';

describe('AdminPatients', () => {
  let component: AdminPatients;
  let fixture: ComponentFixture<AdminPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPatients);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

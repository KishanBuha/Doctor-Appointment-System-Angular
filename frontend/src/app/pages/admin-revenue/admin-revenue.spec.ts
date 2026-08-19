import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRevenue } from './admin-revenue';

describe('AdminRevenue', () => {
  let component: AdminRevenue;
  let fixture: ComponentFixture<AdminRevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRevenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRevenue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

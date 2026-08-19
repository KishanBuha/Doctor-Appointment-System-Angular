import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css' 
})
export class AdminDashboard implements OnInit {

  stats: any = { 
    doctors: 0, 
    patients: 0, 
    appointments: 0, 
    latestAppointments: [] 
  };

  currentDate: Date = new Date(); // Added date

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.http.get<any>('http://localhost:4000/api/admin/dashboard')
      .subscribe({
        next: (res) => {
          if (res.success && res.dashData) {
              this.stats = {
                  doctors: res.dashData.doctors,
                  patients: res.dashData.patients,
                  appointments: res.dashData.appointments,
                  latestAppointments: res.dashData.lastestAppointments || []
              };
              this.cdr.detectChanges();
          }
        },
        error: (err) => console.error("Dashboard Error:", err)
      });
  }
}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css'] 
})
export class DoctorDashboard implements OnInit {

  stats: any = { 
    appointments: 0, 
    patients: 0, 
    experience: 0, // Added experience placeholder
    latestAppointments: [] 
  };
  
  currentDate: Date = new Date();

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchDoctorStats();
  }

  fetchDoctorStats() {
    // Note: We are using a new endpoint or modifying existing to not focus on revenue
    // If backend doesn't support 'dashboard' endpoint yet, we can use 'appointments' endpoint to calculate
    const docId = localStorage.getItem('docId'); // Assuming docId is stored

    this.http.get<any>('http://localhost:4000/api/doctor/dashboard-stats', { headers: { docId: docId || '' } }) 
      .subscribe({
        next: (res) => {
          if (res.success) {
              this.stats = {
                  appointments: res.data.appointmentsCount,
                  patients: res.data.patientsCount,
                  experience: res.data.experience || 0,
                  latestAppointments: res.data.latestAppointments || []
              };
              this.cdr.detectChanges();
          }
        },
        error: (err) => {
            console.error("Doctor Dashboard Error:", err);
            // Fallback if API fails (Optional: Remove in production)
            this.stats.appointments = 0;
            this.stats.patients = 0;
        }
      });
  }
}
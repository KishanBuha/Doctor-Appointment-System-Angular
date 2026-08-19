import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css']
})
export class PatientDashboard implements OnInit {

  appointments: any[] = [];
  recentAppointments: any[] = [];
  errorMessage: string = '';
  currentDate: Date = new Date(); // Added Date

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    // Note: Ensure the API endpoint matches your backend route for listing user appointments
    // Assuming userController uses listAppointment which requires userId in body, 
    // OR if you have a GET route like '/api/user/appointments' that uses token.
    // Based on previous context, we'll try a GET request with token.
    
    // If your backend requires userId in body, you might need to change this to POST or fix backend.
    // Assuming backend endpoint: router.get("/appointments", listAppointment) which uses middleware to get userId
    
    // Using the endpoint from your previous code:
    this.http.get<any>('http://localhost:4000/api/user/appointments') 
    .subscribe({
      next: (res) => {
        if (res.success) {
          this.appointments = res.appointments; 
          // Get top 5 recent
          this.recentAppointments = this.appointments.slice().reverse().slice(0, 5);
          this.cdr.detectChanges();
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => this.errorMessage = "Failed to load appointments"
    });
  }

  getPendingCount() {
    return this.appointments.filter(a => !a.isCompleted && !a.cancelled).length;
  }

  getCompletedCount() {
    return this.appointments.filter(a => a.isCompleted).length;
  }
}
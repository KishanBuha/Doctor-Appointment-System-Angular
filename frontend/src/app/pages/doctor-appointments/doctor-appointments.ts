import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-appointments.html',
  styleUrls: ['./doctor-appointments.css']
})
export class DoctorAppointments implements OnInit {

  appointments: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    const docId = localStorage.getItem('docId');
    if(!docId) return;

    this.http.get<any>(`http://localhost:4000/api/doctor/appointments/${docId}`)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.appointments = res.data.reverse(); // Show latest first
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error("Error fetching appointments:", err)
      });
  }

  // Handle Status Updates (Accept, Complete)
  updateStatus(appointmentId: string, status: string) {
    this.http.post('http://localhost:4000/api/doctor/update-appointment-status', { appointmentId, status })
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            // Show toast or silent update
            const action = status === 'accepted' ? 'Accepted' : 'Completed';
            Swal.fire({
              icon: 'success',
              title: action,
              text: `Appointment has been ${action.toLowerCase()}.`,
              timer: 1500,
              showConfirmButton: false
            });
            this.fetchAppointments();
          }
        },
        error: () => Swal.fire('Error', 'Failed to update status', 'error')
      });
  }

  // Handle Cancellation
  cancelAppointment(appointmentId: string) {
    Swal.fire({
      title: 'Cancel Appointment?',
      text: "Are you sure you want to cancel/reject this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Cancel it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStatus(appointmentId, 'cancelled');
      }
    });
  }

  // Helper to calculate age from DOB
  calculateAge(dob: string): string {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  }
}
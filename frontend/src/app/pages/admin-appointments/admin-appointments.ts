import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import Swal from 'sweetalert2'; // Added SweetAlert

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.css']
})
export class AdminAppointments implements OnInit {

  appointments: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.http.get<any>('http://localhost:4000/api/admin/appointments')
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.appointments = res.appointments.reverse(); // Show latest first
            this.cdr.detectChanges();
          }
        },
        error: () => console.log("Error fetching appointments")
      });
  }

  // Updated to use SweetAlert2
  cancelAppointment(id: string) {
    Swal.fire({
      title: 'Cancel Booking?',
      text: "Are you sure you want to cancel this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post<any>('http://localhost:4000/api/admin/cancel-appointment', { appointmentId: id })
          .subscribe({
            next: (res) => {
              if (res.success) {
                Swal.fire('Cancelled!', 'The appointment has been cancelled.', 'success');
                this.fetchAppointments();
              } else {
                Swal.fire('Error', res.message, 'error');
              }
            },
            error: () => Swal.fire('Error', 'Cancellation failed', 'error')
          });
      }
    });
  }
}
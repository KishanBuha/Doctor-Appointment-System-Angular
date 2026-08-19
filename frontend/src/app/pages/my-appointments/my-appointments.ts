import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css']
})
export class MyAppointments implements OnInit {

  appointments: any[] = [];
  
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    // Assuming backend endpoint is /api/user/appointments which uses token from header
    const token = localStorage.getItem('token');
    
    this.http.get<any>('http://localhost:4000/api/user/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
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

  cancelAppointment(appointmentId: string) {
    Swal.fire({
      title: 'Cancel Appointment?',
      text: "Are you sure you want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Cancel it'
    }).then((result) => {
      if (result.isConfirmed) {
        
        const token = localStorage.getItem('token');
        // Check if userId is needed in body or extracted from token in backend
        // Usually safer to send userId if backend expects it in body, but let's try standard way
        // Assuming userController uses userId from token middleware OR body. 
        // Based on previous code, userController expects { userId, appointmentId } in body.
        
        // We need to decode token to get userId if backend strictly needs it in body
        // BUT, best practice is backend extracts from token. Let's assume we send appointmentId.
        
        // Use a userId if stored, or just send appointmentId if backend middleware handles it.
        // If your login logic stored userId in localStorage:
        const userId = localStorage.getItem('userId'); // Ensure you store this on login!

        this.http.post<any>('http://localhost:4000/api/user/cancel-appointment', { 
            appointmentId,
            userId 
        })
        .subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Cancelled!', 'Your appointment has been cancelled.', 'success');
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
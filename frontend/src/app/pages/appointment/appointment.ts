import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.html',
  styleUrls: ['./appointment.css']
})
export class Appointment implements OnInit {

  docId: string | null = null;
  doctorInfo: any = null;
  loading: boolean = true;
  
  availableSlots: string[] = [];
  bookedSlots: string[] = [];
  
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedTime: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.docId = this.route.snapshot.paramMap.get('docId');
    if (this.docId) {
      this.fetchDoctorDetails();
    }
  }

  fetchDoctorDetails() {
    this.loading = true;
    this.http.get<any>('http://localhost:4000/api/doctor/list').subscribe({
      next: (res) => {
        if (res.success) {
          this.doctorInfo = res.doctors.find((doc: any) => doc._id === this.docId);
          if (this.doctorInfo) {
            this.fetchSlots();
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  // ==========================================
  // FIXED: Sorting Logic for Slots
  // ==========================================
  fetchSlots() {
    if (this.doctorInfo) {
      // 1. Raw slots fetch karo
      let rawSlots: string[] = this.doctorInfo.availableSlots?.[this.selectedDate] || [];
      this.bookedSlots = this.doctorInfo.slots_booked?.[this.selectedDate] || [];

      // 2. Sort slots by time (10 AM -> 11 AM -> 12 PM -> 1 PM)
      rawSlots.sort((a, b) => {
        return this.convertToMinutes(a.split(' - ')[0]) - this.convertToMinutes(b.split(' - ')[0]);
      });

      // 3. Filter past slots if date is Today
      if (this.selectedDate === this.todayDate) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        rawSlots = rawSlots.filter(slot => {
          return this.convertToMinutes(slot.split(' - ')[0]) > currentMinutes;
        });
      }

      this.availableSlots = rawSlots;
      this.cdr.detectChanges();
    }
  }

  // Helper to convert "10:00 AM" to total minutes (e.g., 600)
  private convertToMinutes(timeStr: string): number {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours);
    let m = parseInt(minutes);

    if (modifier === 'PM' && h !== 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;

    return h * 60 + m;
  }

  bookAppointment() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Login Required', 'Please login to book appointment', 'warning');
      this.router.navigate(['/patient-login']);
      return;
    }

    if (!this.selectedTime) {
      Swal.fire('Select Slot', 'Please select a time slot', 'warning');
      return;
    }

    const bookingData = {
      docId: this.docId,
      slotDate: this.selectedDate,
      slotTime: this.selectedTime
    };

    this.http.post<any>('http://localhost:4000/api/user/book-appointment', bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire('Success', 'Appointment booked successfully!', 'success');
          this.router.navigate(['/my-appointments']);
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: () => Swal.fire('Error', 'Booking failed', 'error')
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-schedule.html',
  styleUrls: ['./doctor-schedule.css']
})
export class DoctorSchedule implements OnInit {

  // Time Slots Generation (10:00 AM to 09:00 PM)
  allTimeSlots: string[] = [];
  selectedSlots: string[] = [];
  
  todayDate: string = new Date().toISOString().split('T')[0];
  selectedDate: string = this.todayDate;
  weekStartDate: string = this.todayDate;

  constructor(private http: HttpClient) {
    this.generateSlots();
  }

  ngOnInit() {}

  generateSlots() {
    this.allTimeSlots = [];
    let startTime = 10; // 10 AM
    let endTime = 21;   // 9 PM (21:00)

    for (let i = startTime; i < endTime; i++) {
        let period = i >= 12 ? 'PM' : 'AM';
        let hour = i > 12 ? i - 12 : i;
        let nextHour = (i + 1) > 12 ? (i + 1) - 12 : (i + 1);
        let nextPeriod = (i + 1) >= 12 ? 'PM' : 'AM';
        
        // Full Hour Slots (e.g., 10:00 am - 11:00 am)
        let slot = `${hour}:00 ${period} - ${nextHour}:00 ${nextPeriod}`;
        this.allTimeSlots.push(slot);
    }
  }

  toggleSlot(slot: string) {
    if (this.selectedSlots.includes(slot)) {
      this.selectedSlots = this.selectedSlots.filter(s => s !== slot);
    } else {
      this.selectedSlots.push(slot);
    }
  }

  isSlotSelected(slot: string): boolean {
    return this.selectedSlots.includes(slot);
  }

  selectAll() {
    this.selectedSlots = [...this.allTimeSlots];
  }

  resetSelection() {
    this.selectedSlots = [];
  }

  // Save for Specific Date
  saveSchedule() {
    if (this.selectedSlots.length === 0) {
      Swal.fire('Warning', 'Please select at least one time slot.', 'warning');
      return;
    }

    // NEW: Sort slots before saving
    this.selectedSlots.sort((a, b) => {
        return this.convertToMinutes(a.split(' - ')[0]) - this.convertToMinutes(b.split(' - ')[0]);
    });

    const docId = localStorage.getItem('docId');
    const payload = {
      docId: docId,
      date: this.selectedDate,
      slots: this.selectedSlots
    };

    this.http.post('http://localhost:4000/api/doctor/update-slots', payload)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            Swal.fire('Success', 'Schedule updated successfully!', 'success');
          }
        }
      });
  }

  // saveWeeklySchedule ma pan sort umeji de jo
  saveWeeklySchedule() {
    if (this.selectedSlots.length === 0) {
      Swal.fire('Warning', 'Please select at least one time slot.', 'warning');
      return;
    }

    // Sort slots before saving
    this.selectedSlots.sort((a, b) => {
        return this.convertToMinutes(a.split(' - ')[0]) - this.convertToMinutes(b.split(' - ')[0]);
    });

    const docId = localStorage.getItem('docId');
    const payload = {
      docId: docId,
      date: this.weekStartDate,
      slots: this.selectedSlots
    };

    this.http.post('http://localhost:4000/api/doctor/update-week-slots', payload)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            Swal.fire('Success', 'Weekly schedule applied!', 'success');
          }
        }
      });
  }

  private convertToMinutes(timeStr: string): number {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours);
    let m = parseInt(minutes);
    if (modifier === 'PM' && h !== 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }
  
}
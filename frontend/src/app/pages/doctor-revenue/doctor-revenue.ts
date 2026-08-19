import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-revenue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-revenue.html',
  styleUrl: './doctor-revenue.css'
})
export class DoctorRevenue implements OnInit {

  revenueRecords: any[] = [];
  totalEarnings: number = 0;
  errorMessage: string = '';
  doctorId: string = localStorage.getItem('docId') || ''; 

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadRevenue();
  }

  loadRevenue() {
    if (!this.doctorId) return;

    this.http.get(`http://localhost:4000/api/appointment/doctor-revenue/${this.doctorId}`)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.revenueRecords = res.data || [];
            this.totalEarnings = res.totalEarnings || 0;
            this.cdr.detectChanges(); // UI અપડેટ કરવા માટે
          }
        },
        error: (err) => {
          console.error("Revenue fetch error:", err);
          this.errorMessage = "Failed to load revenue data";
        }
      });
  }
}
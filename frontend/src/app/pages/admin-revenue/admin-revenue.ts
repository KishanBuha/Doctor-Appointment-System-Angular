import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-revenue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-revenue.html'
})
export class AdminRevenue implements OnInit {

  doctorEarnings: any[] = [];
  totalHospitalEarnings: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchMasterRevenue();
  }

  fetchMasterRevenue() {
    // Correct URL for Admin Appointments
    this.http.get('http://localhost:4000/api/admin/appointments')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            const allAppts = res.appointments || [];
            
            // Cancel na thayeli hoy tevi appointments lo
            const validAppts = allAppts.filter((a: any) => !a.cancelled);
            
            // ડોક્ટર વાઈઝ કમાણી નું લોજિક
            const statsMap = new Map();
            validAppts.forEach((a: any) => {
              const docId = a.docId;
              const docData = a.docData;
              
              if (docId && docData) {
                const current = statsMap.get(docId) || { 
                  name: docData.name, 
                  specialization: docData.speciality || 'General', 
                  email: docData.email, 
                  earnings: 0, 
                  appointmentCount: 0 
                };
                
                // Use actual appointment amount
                current.earnings += (a.amount || docData.fees || 500);
                current.appointmentCount += 1;
                statsMap.set(docId, current);
              }
            });

            this.doctorEarnings = Array.from(statsMap.values());
            this.totalHospitalEarnings = this.doctorEarnings.reduce((sum, d) => sum + d.earnings, 0);
          }
        },
        error: (err) => console.error("Admin Revenue Error", err)
      });
  }
}
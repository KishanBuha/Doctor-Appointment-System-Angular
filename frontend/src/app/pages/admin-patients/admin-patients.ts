import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-patients.html',
  styleUrls: ['./admin-patients.css']
})
export class AdminPatients implements OnInit {

  patients: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.http.get('http://localhost:4000/api/admin/all-patients')
      .subscribe({
        next: (res: any) => {
          if(res.success) {
             this.patients = res.patients || [];
             this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error("Error loading patients", err);
        }
      });
  }
  
  deletePatient(id: string) {
    Swal.fire({
      title: 'Remove Patient?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:4000/api/admin/delete-patient/${id}`)
          .subscribe({
            next: (res: any) => {
              if(res.success) {
                  Swal.fire('Deleted!', 'Patient account removed.', 'success');
                  this.loadPatients(); 
              } else {
                  Swal.fire('Error', res.message, 'error');
              }
            },
            error: () => Swal.fire('Error', 'Delete failed', 'error')
          });
      }
    });
  }
}
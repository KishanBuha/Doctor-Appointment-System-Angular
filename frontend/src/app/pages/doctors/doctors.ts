import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css']
})
export class Doctors implements OnInit {

  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchQuery: string = '';
  selectedSpeciality: string = 'All';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllDoctors();
  }

  getAllDoctors() {
    this.http.get<any>('http://localhost:4000/api/doctor/list')
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.doctors = res.doctors;
            this.filteredDoctors = res.doctors;
            
            // Manually trigger change detection to update view
            this.cdr.detectChanges(); 
          }
        },
        error: () => console.log("Error fetching doctors")
      });
  }

  filterDoctors() {
    let temp = this.doctors;
    
    // 1. Speciality Filter
    if (this.selectedSpeciality !== 'All') {
      temp = temp.filter(doc => doc.speciality === this.selectedSpeciality);
    }

    // 2. Search Query
    if (this.searchQuery) {
      temp = temp.filter(doc => 
        doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredDoctors = temp;
    this.cdr.detectChanges(); // Update view after filtering
  }

  filterBySpeciality(speciality: string) {
    this.selectedSpeciality = speciality;
    this.filterDoctors();
  }

  bookAppointment(doctor: any) {
    // Navigate to the new appointment booking page with doctor ID
    this.router.navigate(['/appointment', doctor._id]);
  }
}
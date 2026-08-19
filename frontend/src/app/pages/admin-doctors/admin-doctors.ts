import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-doctors.html',
  styleUrls: ['./admin-doctors.css']
})
export class AdminDoctors implements OnInit {

  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.http.get<any>('http://localhost:4000/api/admin/all-doctors')
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.doctors = res.doctors;
            this.filteredDoctors = res.doctors;
            this.cdr.detectChanges(); 
          }
        },
        error: (err) => console.error("API Error:", err)
      });
  }

  filterDoctors() {
    if (!this.searchQuery) {
        this.filteredDoctors = this.doctors;
    } else {
        this.filteredDoctors = this.doctors.filter(doc =>
            doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            (doc.specialization || doc.speciality || '').toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }
  }

  toggleVisibility(row: any) {
    row.available = !row.available;
    
    // Optional: Call API to save this change permanently
    this.http.post('http://localhost:4000/api/admin/change-availability', {
        docId: row._id,
        isAvailable: row.available
    }).subscribe();
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctor-register.html',
  styleUrl: './doctor-register.css'
})
export class DoctorRegister {

  name: string = '';
  speciality: string = '';
  experience: string = '';
  email: string = '';
  password: string = '';

  // Pre-defined list for Dropdown
  specializations: string[] = [
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Gastroenterologist',
    'Oncologist',
    'Cardiologist',
    'Dentist',
    'Psychiatrist',
    'Urologist',
    'Orthopedist'
  ];

  constructor(private http: HttpClient, private router: Router) {}

  registerDoctor() {
    if (!this.name || !this.email || !this.password || !this.speciality || !this.experience) {
      alert("Please fill in all required fields.");
      return;
    }

    const doctorData = {
      name: this.name,
      speciality: this.speciality,
      experience: this.experience,
      email: this.email,
      password: this.password
    };

    // Note: Ensure your backend 'api/doctor/register' supports these fields without Image/Address
    this.http.post('http://localhost:4000/api/doctor/register', doctorData).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert("Doctor Registered Successfully!");
          this.router.navigate(['/doctor-login']); 
        } else {
          alert(res.message);
        }
      },
      error: (err: any) => {
        console.error("Registration Error:", err);
        alert(err.error?.message || "Registration Failed");
      }
    });
  }
}
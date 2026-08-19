import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './patient-register.html',
  styleUrl: './patient-register.css'
})
export class PatientRegister {
  name = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post<any>('http://localhost:4000/api/user/register', {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          alert("Registration Successful! Please login.");
          this.router.navigate(['/patient-login']);
        } else {
          alert(res.message);
        }
      },
      error: (err) => alert(err.error?.message || "Registration Failed")
    });
  }
}
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule], // HttpClientModule ahia hovu joie
  templateUrl: './patient-login.html',
  styleUrl: './patient-login.css'
})
export class PatientLogin {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:4000/api/user/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("role", "Patient"); 
          this.router.navigate(['/patient-dashboard']);
        } else {
          alert(res.message);
        }
      },
      error: (err) => alert(err.error?.message || "Login Failed")
    });
  }
}
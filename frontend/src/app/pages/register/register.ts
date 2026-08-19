import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const userData = { name: this.name, email: this.email, password: this.password };

    this.http.post<any>('http://localhost:4000/api/user/register', userData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.successMessage = "Registration successful! Please login.";
            this.errorMessage = '';
            setTimeout(() => this.router.navigate(['/login']), 1500);
          } else {
            this.errorMessage = res.message;
            this.successMessage = '';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || "Registration failed";
          this.successMessage = '';
        }
      });
  }
}
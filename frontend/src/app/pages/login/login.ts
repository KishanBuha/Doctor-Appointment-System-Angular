import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginData = { email: this.email, password: this.password };

    // Port 4000 ane sacho route /api/user/login
    this.http.post<any>('http://localhost:4000/api/user/login', loginData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("role", "Patient"); // Role Guard mate jaruri
            this.router.navigate(['/patient-dashboard']); // Dashboard par moklo
          } else {
            this.errorMessage = res.message;
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || "Login failed";
        }
      });
  }
}
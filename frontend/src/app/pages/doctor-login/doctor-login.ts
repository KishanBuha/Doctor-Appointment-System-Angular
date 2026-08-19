import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './doctor-login.html',
  styleUrl: './doctor-login.css',
})
export class DoctorLogin {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      alert('All fields required');
      return;
    }

    // login() function ni andar update karo:
    this.http
      .post<any>('http://localhost:4000/api/doctor/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', 'Doctor');
            // Ahia Doctor ni ID save karo jethi baki pages ma hardcoded ID kadhi shakay
            localStorage.setItem('docId', res.docId || '');
            this.router.navigate(['/doctor-dashboard']);
          } else {
            alert(res.message);
          }
        },
      });
  }
}

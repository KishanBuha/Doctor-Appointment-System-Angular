import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Router ઈમ્પોર્ટ કર્યું

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './admin-register.html',
  styleUrl: './admin-register.css'
})
export class AdminRegister {

  name = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {} // Router એડ કર્યું

  register() {
    this.http.post('http://localhost:4000/api/admin/register', {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
           alert("Admin Registered Successfully! Please Login.");
           this.router.navigate(['/admin-login']); // રજીસ્ટર થઈને સીધા લોગિન પર
        } else {
           alert(res.message || "Registration Failed");
        }
      },
      error: (err: any) => alert(err.error?.message || "Registration Failed")
    });
  }
}
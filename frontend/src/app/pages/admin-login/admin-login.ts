import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css' 
})
export class AdminLogin {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    // ૧. પહેલા ચેક કરો કે ઈમેઈલ-પાસવર્ડ ખાલી તો નથી ને?
    if (!this.email || !this.password) {
        alert("Please enter both Email and Password!");
        return;
    }

    const loginBody = { email: this.email, password: this.password };

    this.http.post('http://localhost:4000/api/admin/login', loginBody)
      .subscribe({
        next: (res: any) => {
          // ૨. બેકએન્ડમાંથી success આવે એટલે ડેટા સેવ કરો
          if (res.success) {
            alert("Login Successful! Redirecting to Dashboard..."); // તમને ખબર પડશે કે લોગિન થઈ ગયું
            
            localStorage.setItem("token", res.token); 
            localStorage.setItem("role", "Admin");
            
            // ૩. Angular નું સ્ટાન્ડર્ડ નેવિગેશન (આ કોઈ દિવસ ફેલ નહિ થાય)
            this.router.navigate(['/admin-dashboard']).then(() => {
                window.location.reload(); // Navbar અપડેટ કરવા માટે
            });
            
          } else {
             alert(res.message || "Invalid Admin Credentials!");
          }
        },
        error: (err: any) => {
          console.error("Login Error:", err);
          alert("Server Error! બેકએન્ડ ચાલુ છે કે નહિ તે ચેક કરો.");
        }
      });
  }
}
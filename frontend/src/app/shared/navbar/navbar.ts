// DAS/frontend/src/app/shared/navbar/navbar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  userRole: string = '';
  isLoggedIn: boolean = false;
  isCleanNavbar: boolean = false; // Renamed to cover home, login, and register pages

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbar();
        this.checkCleanNavbar(this.router.url);
      }
    });
  }

  ngOnInit() {
    this.updateNavbar();
    this.checkCleanNavbar(this.router.url);
  }

  // Helper method to determine if navbar should be empty
  checkCleanNavbar(url: string) {
    // True if it's the home page, OR if the URL contains 'login' or 'register'
    this.isCleanNavbar = url === '/' || url.includes('login') || url.includes('register');
  }

  updateNavbar() {
    this.userRole = (localStorage.getItem('role') || '').toLowerCase();
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  logout() {
    const currentRole = this.userRole;
    localStorage.clear();
    this.updateNavbar(); 
    
    if (currentRole === 'admin') {
      this.router.navigate(['/admin-login']);
    } else if (currentRole === 'doctor') {
      this.router.navigate(['/doctor-login']);
    } else {
      this.router.navigate(['/patient-login']); 
    }
  }
}
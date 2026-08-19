import { Routes } from '@angular/router';
import { roleGuard } from './guards/role-guard'; 

// Home & Shared
import { Home } from './pages/home/home';
import { Doctors } from './pages/doctors/doctors';

// Patient
import { PatientLogin } from './pages/patient-login/patient-login';
import { PatientRegister } from './pages/patient-register/patient-register';
import { PatientDashboard } from './pages/patient-dashboard/patient-dashboard';
import { MyAppointments } from './pages/my-appointments/my-appointments';
import { Appointment } from './pages/appointment/appointment';

// Doctor
import { DoctorLogin } from './pages/doctor-login/doctor-login';
import { DoctorRegister } from './pages/doctor-register/doctor-register';
import { DoctorDashboard } from './pages/doctor-dashboard/doctor-dashboard';
import { DoctorAppointments } from './pages/doctor-appointments/doctor-appointments';
import { DoctorSchedule } from './pages/doctor-schedule/doctor-schedule';

// Admin
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminRegister } from './pages/admin-register/admin-register'; 
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminAppointments } from './pages/admin-appointments/admin-appointments';
import { AdminDoctors } from './pages/admin-doctors/admin-doctors';
import { AdminPatients } from './pages/admin-patients/admin-patients';

export const routes: Routes = [
  // Public Routes
  { path: '', component: Home },
  
  // PATIENT LOGIN / REGISTER ROUTES
  { path: 'login', redirectTo: 'patient-login', pathMatch: 'full' }, 
  { path: 'patient-login', component: PatientLogin },
  { path: 'patient-register', component: PatientRegister },
  
  { path: 'doctors', component: Doctors },
  { path: 'doctor-login', component: DoctorLogin },
  { path: 'doctor-register', component: DoctorRegister },
  { path: 'admin-login', component: AdminLogin },
  { path: 'admin-register', component: AdminRegister },

  // ==========================================
  // PATIENT PROTECTED ROUTES
  // ==========================================
  { path: 'patient-dashboard', component: PatientDashboard, canActivate: [roleGuard], data: { role: 'Patient' } },
  { path: 'my-appointments', component: MyAppointments, canActivate: [roleGuard], data: { role: 'Patient' } },
  { path: 'appointment/:docId', component: Appointment },

  // ==========================================
  // DOCTOR PROTECTED ROUTES
  // ==========================================
  { path: 'doctor-dashboard', component: DoctorDashboard, canActivate: [roleGuard], data: { role: 'Doctor' } },
  { path: 'doctor-appointments', component: DoctorAppointments, canActivate: [roleGuard], data: { role: 'Doctor' } },
  { path: 'doctor-schedule', component: DoctorSchedule, canActivate: [roleGuard], data: { role: 'Doctor' } },
  
  // ==========================================
  // ADMIN PROTECTED ROUTES
  // ==========================================
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [roleGuard], data: { role: 'Admin' } },
  { path: 'admin-doctors', component: AdminDoctors, canActivate: [roleGuard], data: { role: 'Admin' } },
  { path: 'admin-patients', component: AdminPatients, canActivate: [roleGuard], data: { role: 'Admin' } },
  { path: 'admin-appointments', component: AdminAppointments, canActivate: [roleGuard], data: { role: 'Admin' } },
  
  // જો કોઈ પાથ ન મળે તો Home પર જાઓ
  { path: '**', redirectTo: '' }
];
import express from "express";
import { 
    registerDoctor, 
    loginDoctor, 
    changeAvailablity, 
    doctorList,
    getDoctorProfile,
    updateAvailableSlots,
    updateAppointmentStatus, 
    rescheduleAppointment,
    updateWeekSlots,
    resetSlots,
    getDoctorAppointments, // 1. IMPORT ADDED
    doctorDashboardStats   // 2. DASHBOARD STATS IMPORT (Turn 18 ma add karyu hatu)
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/list", doctorList);

router.post("/change-availability", changeAvailablity);
router.post("/get-profile", getDoctorProfile);
router.post("/update-slots", updateAvailableSlots); 
router.post("/update-week-slots", updateWeekSlots);
router.post("/reset-slots", resetSlots);

// Appointments Management
router.get("/appointments/:docId", getDoctorAppointments); // 3. ROUTE ADDED (Aa missing hatu)
router.post("/update-appointment-status", updateAppointmentStatus);
router.post("/reschedule-appointment", rescheduleAppointment);

// Dashboard Stats
router.get("/dashboard-stats", doctorDashboardStats); // 4. DASHBOARD ROUTE

export default router;
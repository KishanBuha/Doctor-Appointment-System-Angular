import express from "express";
import { 
    registerAdmin, 
    loginAdmin, 
    addDoctor, 
    allDoctors, 
    appointmentsAdmin, 
    appointmentCancel, 
    adminDashboard,
    allPatients,
    deletePatient,
    changeAvailability
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js"; 


const router = express.Router();

// ------------------------------------
// PUBLIC ROUTES
// ------------------------------------
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ------------------------------------
// PROTECTED ROUTES (Admin Login Required)
// ------------------------------------
router.post("/add-doctor", authAdmin, upload.single('image'), addDoctor);
router.get("/all-doctors", authAdmin, allDoctors);
router.get("/appointments", authAdmin, appointmentsAdmin);
router.post("/cancel-appointment", authAdmin, appointmentCancel);
router.get("/dashboard", authAdmin, adminDashboard);
router.get("/all-patients", authAdmin, allPatients);
router.delete("/delete-patient/:id", authAdmin, deletePatient);
router.post("/change-availability", authAdmin, changeAvailability);

export default router;
import express from "express";
import { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    cancelAppointment 
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js"; 

const router = express.Router();

// ------------------------------------
// PUBLIC ROUTES (No login required)
// ------------------------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// ------------------------------------
// PROTECTED ROUTES (Login required - authUser middleware applied)
// ------------------------------------

// User Profile Routes
router.get("/get-profile", authUser, getProfile);
router.post("/update-profile", upload.single('image'), authUser, updateProfile);

// Appointment Routes
router.post("/book-appointment", authUser, bookAppointment);
router.get("/appointments", authUser, listAppointment);
router.post("/cancel-appointment", authUser, cancelAppointment);

export default router;
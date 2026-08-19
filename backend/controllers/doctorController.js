import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from "validator"

// API for doctor registration
const registerDoctor = async (req, res) => {
    try {
        // 1. Destructure the exact fields sent from the frontend
        const { name, email, password, speciality, experience } = req.body; 
        
        // 2. Validate required fields
        if (!name || !email || !password || !speciality || !experience) {
            return res.json({ success: false, message: 'Please enter all fields including Speciality and Experience' });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }
        
        const exists = await doctorModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Doctor already exists." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 3. Create Doctor Object matching Schema requirements
        const doctorData = {
            name, 
            email, 
            password: hashedPassword,
            speciality,      
            experience: experience.toString() + ' Years', // Append 'Years' to match string format
            image: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`,
            fees: 500, // Explicitly provide the required fee
            address: { line1: "Not Provided", line2: "" }, // Explicitly provide a default object
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        const doctor = await newDoctor.save();
        
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log("Error during Doctor Registration:", error); // <-- Add console.log for backend debugging
        res.json({ success: false, message: error.message });
    }
};

// API for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, docId: doctor._id });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to change doctor availability switch
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availability status updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get all doctors list for patients
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ available: true }).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor profile for doctor panel
const getDoctorProfile = async (req, res) => {
    try {
        const { docId } = req.body; 
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({ success: true, profileData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to update available slots
const updateAvailableSlots = async (req, res) => {
    try {
        const { docId, slots, date } = req.body;
        const docData = await doctorModel.findById(docId);
        let availableSlots = docData.availableSlots || {};
        availableSlots[date] = slots;
        await doctorModel.findByIdAndUpdate(docId, { availableSlots });
        res.json({ success: true, message: "Schedule updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body; 
        let updateData = {};
        if (status === 'accepted') {
            updateData = { isAccepted: true, cancelled: false };
        } else if (status === 'completed') {
            updateData = { isCompleted: true, isMissed: false, cancelled: false };
        } else if (status === 'missed') {
            updateData = { isMissed: true, cancelled: true, isCompleted: false };
        } else if (status === 'cancelled') {
            updateData = { cancelled: true, isAccepted: false, isCompleted: false };
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, updateData);
        res.json({ success: true, message: `Appointment status updated to ${status}` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  try {
      const { appointmentId, newDate, newTime } = req.body;
      const appointment = await appointmentModel.findById(appointmentId);
      const doctorData = await doctorModel.findById(appointment.docId);
      let slots_booked = doctorData.slots_booked;
      slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(e => e !== appointment.slotTime);
      if (!slots_booked[newDate]) slots_booked[newDate] = [];
      slots_booked[newDate].push(newTime);
      await appointmentModel.findByIdAndUpdate(appointmentId, { slotDate: newDate, slotTime: newTime, isMissed: false, cancelled: false });
      await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });
      res.json({ success: true, message: "Rescheduled successfully" });
  } catch (error) {
      res.json({ success: false, message: error.message });
  }
}

const getDoctorAppointments = async (req, res) => {
  try {
      const { docId } = req.params;
      const appointments = await appointmentModel.find({ docId });
      res.json({ success: true, data: appointments });
  } catch (error) {
      res.json({ success: false, message: error.message });
  }
}

const updateWeekSlots = async (req, res) => {
    try {
        const { docId, slots, date } = req.body;
        const docData = await doctorModel.findById(docId);
        let availableSlots = docData.availableSlots || {};
        let startDate = new Date(date);
        for (let i = 0; i < 7; i++) {
            let nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            let dateString = nextDate.toISOString().split('T')[0];
            availableSlots[dateString] = slots;
        }
        await doctorModel.findByIdAndUpdate(docId, { availableSlots });
        res.json({ success: true, message: "Weekly schedule updated successfully!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const resetSlots = async (req, res) => {
    try {
        const { docId } = req.body;
        await doctorModel.findByIdAndUpdate(docId, { slots_booked: {} });
        res.json({ success: true, message: "All booked slots have been reset!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// NEW: API for Doctor Dashboard Stats
const doctorDashboardStats = async (req, res) => {
    try {
        const { docid } = req.headers; // Frontend sends 'docId' in headers

        if (!docid) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }

        const appointments = await appointmentModel.find({ docId: docid });
        const doctor = await doctorModel.findById(docid);

        // Calculate unique patients
        let patients = new Set();
        appointments.forEach(appt => {
             if(appt.userId) patients.add(appt.userId.toString());
        });

        const dashData = {
            appointmentsCount: appointments.length,
            patientsCount: patients.size,
            experience: doctor.experience,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, data: dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    registerDoctor, 
    loginDoctor, 
    changeAvailablity, 
    doctorList, 
    getDoctorProfile, 
    updateAvailableSlots, 
    getDoctorAppointments, 
    updateWeekSlots, 
    updateAppointmentStatus, 
    rescheduleAppointment,
    resetSlots,
    doctorDashboardStats // <-- Don't forget to export this
}
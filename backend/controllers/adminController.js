import validator from "validator"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import doctorModel from "../models/doctorModel.js"
import userModel from "../models/userModel.js"
import adminModel from "../models/adminModel.js"

// API for admin registration
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please enter all fields." });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters." });
        }
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Admin with this email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new adminModel({ name, email, password: hashedPassword });
        const admin = await newAdmin.save();
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error occurred" });
    }
};

// API for adding doctor (REMOVED FEES)
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, address } = req.body; // Fees removed
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !address) { // Fees check removed
      return res.json({ success: false, message: 'Missing Details' });
    }

    if (!imageFile) {
      return res.json({ success: false, message: 'Please upload doctor profile image' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' });
    }

    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      return res.json({ success: false, message: 'Invalid address format' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name, email, image: imageUrl, password: hashedPassword, speciality,
      degree, experience, about, address: parsedAddress, date: Date.now()
    }; // Fees removed from object

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: 'Doctor Added' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
        return res.json({ success: false, message: "Admin not found in Database." });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.json({ success: false, message: "Invalid Password." });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred" });
  }
}

// API to get all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get all appointments
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked

    if (slots_booked && slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    }
    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// PATIENT MANAGEMENT
const allPatients = async (req, res) => {
    try {
        const patients = await userModel.find({}).select('-password');
        res.json({ success: true, patients });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const deletePatient = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Patient account permanently deleted' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Dashboard Data
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      lastestAppointments: appointments.reverse().slice(0, 5)
    }
    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message})
  }
}

// API to change doctor availability
const changeAvailability = async (req, res) => {
  try {
      const { docId } = req.body;
      
      // Find the doctor and flip their current availability status
      const docData = await doctorModel.findById(docId);
      await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
      
      res.json({ success: true, message: 'Availability changed successfully' });
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
  }
}
      
export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard, registerAdmin, allPatients, deletePatient, changeAvailability }
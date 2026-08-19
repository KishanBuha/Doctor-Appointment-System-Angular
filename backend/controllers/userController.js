import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({ success: false, message: 'Missing Details' });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' });
    }
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User with this email already exists." });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password (min 8 characters)' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { name, email, password: hashedPassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Get Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' });
    }
    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      return res.json({ success: false, message: 'Invalid address format' });
    }
    await userModel.findByIdAndUpdate(userId, { name, phone, address: parsedAddress, dob, gender });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: 'Profile Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Book Appointment (REMOVED FEES/AMOUNT)
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData || !docData.available) {
      return res.json({ success: false, message: 'Doctor is currently not accepting appointments' });
    }

    let availableSlots = docData.availableSlots || {};
    if (!availableSlots[slotDate] || !availableSlots[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: 'This specific time slot is not open for booking today' });
    }

    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: 'This slot is already booked by another patient' });
    }

    if (!slots_booked[slotDate]) { slots_booked[slotDate] = []; }
    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select('-password');
    const appointmentData = {
      userId, docId, userData,
      docData: docData.toObject(),
      slotTime, slotDate, date: Date.now()
    }; // Amount removed

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    docData.slots_booked = slots_booked;
    docData.markModified('slots_booked');
    await docData.save();

    res.json({ success: true, message: 'Appointment Booked Successfully!' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// List Appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }
    res.json({ success: true, message: 'Appointment Cancelled' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };
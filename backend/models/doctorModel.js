import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
  speciality: { type: String, default: "Not Specified" },
  degree: { type: String, default: "Not Specified" },
  experience: { type: String, default: "1 Year" },
  about: { type: String, default: "Not Specified" },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true, default: 500 },
  address: { type: Object, default: { line1: '', line2: '' } },
  date: { type: Number, required: true, default: Date.now },
  slots_booked: { type: Object, default: {} },
  availableSlots: { type: Object, default: {} } 
}, { minimize: false, timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
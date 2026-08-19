import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    date: { type: Number, required: true },
    
    // Status Fields
    cancelled: { type: Boolean, default: false },
    isAccepted: { type: Boolean, default: false }, // 🌟 New Field for Accepted Status
    isCompleted: { type: Boolean, default: false }, // Attempted
    isMissed: { type: Boolean, default: false }     // Missed
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
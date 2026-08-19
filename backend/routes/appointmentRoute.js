import express from "express";
import Appointment from "../models/appointmentModel.js";

const appointmentRouter = express.Router(); 

// ૧. ડૉક્ટર મુજબ રેવન્યુ અને એપોઇન્ટમેન્ટ લિસ્ટ મેળવવી
// ફ્રન્ટએન્ડ આ એન્ડપોઇન્ટનો ઉપયોગ ડેટા બતાવવા માટે કરે છે
appointmentRouter.get("/doctor-revenue/:docId", async (req, res) => {
    try {
        const { docId } = req.params;

        // ડૉક્ટરની એવી એપોઇન્ટમેન્ટ્સ શોધો જે કેન્સલ ન થઈ હોય
        const appointments = await Appointment.find({ docId: docId });

        // કુલ કમાણી ગણવા માટે (માત્ર જે એપોઇન્ટમેન્ટ કમ્પ્લીટ થઈ હોય તેની ફી ગણવી)
        const totalEarnings = appointments
            .filter(appt => appt.isCompleted && !appt.cancelled)
            .reduce((sum, appt) => sum + (appt.amount || 0), 0);

        res.json({ 
            success: true, 
            data: appointments, // એપોઇન્ટમેન્ટ લિસ્ટ
        });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
});

// ૨. એપોઇન્ટમેન્ટ લિસ્ટ (વધારાનો રૂટ જો જરૂર હોય તો)
appointmentRouter.put("/update-status/:id", async (req, res) => {
    try {
        const { isCompleted } = req.body;
        await Appointment.findByIdAndUpdate(req.params.id, { isCompleted: isCompleted });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
});

// ૩. સ્ટેટસ અપડેટ (Attempted / Completed)
// ફ્રન્ટએન્ડમાં 'Confirm' અથવા 'Attempted' બટન માટે વપરાય છે
appointmentRouter.put("/update-status/:id", async (req, res) => {
    try {
        const { isCompleted } = req.body;
        // એપોઇન્ટમેન્ટ આઈડી મુજબ સ્ટેટસ અપડેટ કરો
        const updatedAppt = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { isCompleted: isCompleted }, 
            { new: true }
        );

        if (!updatedAppt) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        res.json({ success: true, message: "Appointment Status Updated" });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
});

export default appointmentRouter;
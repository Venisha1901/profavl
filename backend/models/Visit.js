// models/Visit.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  studentRollNo: { type: String, required: true },
  professorName: { type: String, required: true },
  purpose: { type: String, required: true },
  visitDay: { type: String, required: true }, 
  slotTime: { type: String, required: true } // e.g., "10:00 AM - 10:30 AM"
});

export default mongoose.model("Visit", visitSchema);

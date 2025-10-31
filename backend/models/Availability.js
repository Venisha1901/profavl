import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  professorName: { type: String, required: true },
  day: { type: String, required: true }, // e.g. "Monday", "Tuesday"
  slots: [
    {
      time: { type: String, required: true },   // e.g. "10:00 AM - 10:30 AM"
      isBooked: { type: Boolean, default: false }
    }
  ]
});

export default mongoose.model("Availability", availabilitySchema);

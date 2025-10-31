import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cabinLocation: { type: String, required: true }, // e.g., "Block B, Room 204"
  
  // professor can teach multiple semesters and subjects
  teaching: [
    {
      semester: { type: Number, required: true },   // e.g., 1, 3
      subjects: [{ type: String, required: true }]  // e.g., ["Maths 1", "Algebra"]
    }
  ]
});

export default mongoose.model("Professor", professorSchema);

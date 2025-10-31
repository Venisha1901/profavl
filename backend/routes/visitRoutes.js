import express from "express";
import Visit from "../models/Visit.js";
import Availability from "../models/Availability.js";
const router = express.Router();

/*
----------------------------------------
 POST /api/visits
 - Log a new student visit
----------------------------------------
Body: { studentRollNo, professorName, purpose, visitDay, slotTime }
*/
router.post("/", async (req, res) => {
  try {
    const { studentRollNo, professorName, purpose, visitDay, slotTime } = req.body;
    const visit = new Visit({ studentRollNo, professorName, purpose, visitDay, slotTime });
    await visit.save();
    res.json({ message: "Visit logged successfully", visit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
----------------------------------------
 GET /api/visits
 - List all visits (optionally filtered by professor or day)
----------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const { professorName, visitDay } = req.query;
    const query = {};
    if (professorName) query.professorName = professorName;
    if (visitDay) query.visitDay = visitDay;

    const visits = await Visit.find(query).sort({ visitDay: 1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
----------------------------------------
 GET /api/visits/stats
 - Aggregation: total visits per professor
----------------------------------------
*/
router.get("/stats", async (req, res) => {
  try {
    const stats = await Visit.aggregate([
      { $group: { _id: "$professorName", totalVisits: { $sum: 1 } } },
      { $sort: { totalVisits: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
----------------------------------------
 DELETE /api/visits/:id
 - Delete a visit by ID
----------------------------------------
*/
router.delete("/:id", async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    // Step 1️⃣ Delete visit record
    await Visit.findByIdAndDelete(req.params.id);

    // Step 2️⃣ Free corresponding slot
    await Availability.updateOne(
      {
        professorName: visit.professorName,
        day: visit.visitDay,
        "slots.time": visit.slotTime,
      },
      { $set: { "slots.$.isBooked": false } }
    );

    res.json({ message: "Visit deleted and slot freed", visit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;

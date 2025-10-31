import express from "express";
import Availability from "../models/Availability.js";
const router = express.Router();

/*
----------------------------------------
 GET /api/availability?professorName=Dishant%20Shah&day=Monday
 - Filter by professor and day
 - Sort slots by time
----------------------------------------
*/
// router.get("/", async (req, res) => {
//   try {
//     const { professorName, day } = req.query;
//     const query = {};
//     if (professorName) query.professorName = professorName;
//     if (day) query.day = day;

//     const data = await Availability.find(query).sort({ day: 1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const { professorName, day } = req.query;
    const query = {};
    if (professorName) query.professorName = professorName;
    if (day) query.day = day;

    // Find all matching documents
    const data = await Availability.find(query).sort({ day: 1 });

    // Filter out booked slots
    const filtered = data.map(item => ({
      _id: item._id,
      professorName: item.professorName,
      day: item.day,
      slots: item.slots.filter(slot => !slot.isBooked)
    }));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/*
----------------------------------------
 PUT /api/availability/book
 - Book a specific slot
----------------------------------------
Body: { professorName, day, slotTime }
*/
router.put("/book", async (req, res) => {
  try {
    const { professorName, day, slotTime } = req.body;

    const result = await Availability.updateOne(
      { professorName, day, "slots.time": slotTime },
      { $set: { "slots.$.isBooked": true } }
    );

    res.json({ message: "Slot booked successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
----------------------------------------
 PUT /api/availability/reset
 - Admin/cron route to reset all slots
----------------------------------------
*/
router.put("/reset", async (req, res) => {
  try {
    const all = await Availability.updateMany(
      {},
      { $set: { "slots.$[].isBooked": false } }
    );
    res.json({ message: "All slots reset successfully", all });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

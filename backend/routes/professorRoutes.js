import express from "express";
import Professor from "../models/Professor.js";
const router = express.Router();

/*
----------------------------------------
 GET /api/professors
 - Fetch all professors
 - Optional filters: department, semester, subject
 - Optional sorting: name, department
----------------------------------------
 Example: /api/professors?department=Math&sort=name
*/
router.get("/", async (req, res) => {
  try {
    const { department, semester, subject, sort } = req.query;

    // Build query dynamically
    const query = {};
    if (department) query.department = department;
    if (semester) query["teaching.semester"] = Number(semester);
    if (subject) query["teaching.subjects"] = subject;

    // Mongo query with optional sort
    const professors = await Professor.find(query).sort({ [sort || "name"]: 1 });
    res.json(professors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
----------------------------------------
 GET /api/professors/subjects
 - Aggregation: show unique subjects taught per department
----------------------------------------
*/
router.get("/subjects", async (req, res) => {
  try {
    const subjectsByDept = await Professor.aggregate([
      { $unwind: "$teaching" },
      { $unwind: "$teaching.subjects" },
      {
        $group: {
          _id: "$department",
          subjects: { $addToSet: "$teaching.subjects" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(subjectsByDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
----------------------------------------
 GET /api/professors/count
 - Simple analytics: count professors per department
----------------------------------------
*/
router.get("/count", async (req, res) => {
  try {
    const countData = await Professor.aggregate([
      { $group: { _id: "$department", totalProfessors: { $sum: 1 } } },
      { $sort: { totalProfessors: -1 } },
    ]);
    res.json(countData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

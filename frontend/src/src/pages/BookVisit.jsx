import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../api"
import "./BookVisit.css"

export default function BookVisit() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    studentRollNo: "",
    purpose: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.studentRollNo.trim() || !formData.purpose.trim()) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      // Create visit
      await api.post("/visits", {
        studentRollNo: formData.studentRollNo,
        professorName: state.professorName,
        purpose: formData.purpose,
        visitDay: state.day,
        slotTime: state.slotTime,
      })

      // Mark slot as booked
      await api.put("/availability/book", {
        professorName: state.professorName,
        day: state.day,
        slotTime: state.slotTime,
      })

      alert("✓ Visit booked successfully!")
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book visit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!state) {
    return (
      <div className="book-visit-container">
        <div className="error-message">Invalid booking request. Please go back and try again.</div>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="book-visit-container">
      <div className="book-visit-card">
        <h1 className="book-visit-title">📅 Schedule Your Visit</h1>

        <div className="visit-details">
          <div className="detail-item">
            <span className="detail-label">Professor:</span>
            <span className="detail-value">{state.professorName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Day:</span>
            <span className="detail-value">{state.day}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time Slot:</span>
            <span className="detail-value">{state.slotTime}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="book-visit-form">
          <div className="form-group">
            <label htmlFor="studentRollNo" className="form-label">
              Student Roll Number *
            </label>
            <input
              id="studentRollNo"
              type="text"
              name="studentRollNo"
              className="form-input"
              placeholder="e.g., 2021001"
              value={formData.studentRollNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose" className="form-label">
              Purpose of Visit *
            </label>
            <textarea
              id="purpose"
              name="purpose"
              className="form-textarea"
              placeholder="Briefly describe the purpose of your visit..."
              value={formData.purpose}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Booking..." : "✓ Confirm Booking"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
import { useState } from "react"
import api from "../api"
import AvailabilityList from "./AvailabilityList"
import "./ProfessorCard.css"

export default function ProfessorCard({ professor }) {
  const [availability, setAvailability] = useState([])
  const [showAvailability, setShowAvailability] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadAvailability = async () => {
    setLoading(true)
    try {
      const res = await api.get("/availability", {
        params: { professorName: professor.name },
      })
      setAvailability(res.data)
      setShowAvailability(true)
    } catch (err) {
      console.error("Error loading availability:", err)
      alert("Failed to load availability")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="professor-card">
      <div className="professor-card-header">
        <h3 className="professor-name">{professor.name}</h3>
        <span className="professor-badge">{professor.department}</span>
      </div>

      <div className="professor-card-body">
        <div className="professor-info">
          <p className="info-item">
            <span className="info-label">📧 Email:</span>
            <span className="info-value">{professor.email}</span>
          </p>
          <p className="info-item">
            <span className="info-label">🏢 Cabin:</span>
            <span className="info-value">{professor.cabinLocation}</span>
          </p>
        </div>

        <button
          className={`availability-btn ${showAvailability ? "active" : ""}`}
          onClick={loadAvailability}
          disabled={loading}
        >
          {loading ? "Loading..." : showAvailability ? "Hide Availability" : "Show Availability"}
        </button>
      </div>

      {showAvailability && (
        <div className="professor-card-availability">
          <AvailabilityList professor={professor} availability={availability} />
        </div>
      )}
    </div>
  )
}
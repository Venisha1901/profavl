import { useNavigate } from "react-router-dom"
import "./AvailabilityList.css"

export default function AvailabilityList({ professor, availability }) {
  const navigate = useNavigate()

  const handleScheduleVisit = (day, slot) => {
    navigate("/book", {
      state: {
        professorName: professor.name,
        day: day,
        slotTime: slot.time,
        slotStatus: slot.status,
      },
    })
  }

  return (
    <div className="availability-list">
      {availability.length === 0 ? (
        <p className="no-slots">No availability data found.</p>
      ) : (
        <div className="availability-grid">
          {availability.map((dayAvail) => (
            <div key={dayAvail._id} className="day-card">
              <h4 className="day-title">📅 {dayAvail.day}</h4>
              <div className="slots-container">
                {dayAvail.slots.length === 0 ? (
                  <p className="no-slots-day">No slots available</p>
                ) : (
                  dayAvail.slots.map((slot) => (
                    <button
                      key={slot.time}
                      className={`slot-btn ${slot.status === "booked" ? "booked" : "available"}`}
                      onClick={() => handleScheduleVisit(dayAvail.day, slot)}
                      disabled={slot.status === "booked"}
                    >
                      <span className="slot-time">{slot.time}</span>
                      <span className="slot-status">{slot.status === "booked" ? "✓ Booked" : "Available"}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
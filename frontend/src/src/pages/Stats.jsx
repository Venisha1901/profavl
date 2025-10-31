import { useState, useEffect } from "react"
import api from "../api"
import "./Stats.css"

export default function Stats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/visits/stats")
      setStats(res.data)
    } catch (err) {
      setError("Failed to load statistics")
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1 className="stats-title">📊 Visit Statistics</h1>
        <p className="stats-subtitle">Overview of professor visit bookings</p>
      </div>

      {loading && <div className="loading">Loading statistics...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && stats.length === 0 && (
        <div className="no-data">
          <p>No visit data available yet.</p>
        </div>
      )}

      {!loading && !error && stats.length > 0 && (
        <div className="stats-table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Professor Name</th>
                <th>Total Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => (
                <tr key={stat._id || index} className={index % 2 === 0 ? "even" : "odd"}>
                  <td className="prof-name">{stat._id || "Unknown"}</td>
                  <td className="visit-count">
                    <span className="badge">{stat.totalVisits}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="refresh-btn" onClick={fetchStats}>
        🔄 Refresh
      </button>
    </div>
  )
}
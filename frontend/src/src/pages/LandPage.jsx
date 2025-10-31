import { useState } from "react"
import ProfessorList from "../components/ProfessorList"
import api from "../api"
import "./LandPage.css"

export default function LandPage() {
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    subject: "",
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.get("/professors", { params: filters })
      setProfessors(res.data)
    } catch (err) {
      console.error("Error fetching professors:", err)
      alert("Failed to fetch professors")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="land-page-container">
      <div className="land-page-header">
        <h1 className="land-page-title">🎓 Professor Availability Portal</h1>
        <p className="land-page-subtitle">Find your professor's availability and schedule a visit</p>
      </div>

      <form className="land-page-filters" onSubmit={handleSearch}>
        <div className="filter-group">
          <input
            className="filter-input"
            type="text"
            name="department"
            placeholder="Department"
            value={filters.department}
            onChange={handleInputChange}
          />
        </div>

        <div className="filter-group">
          <input
            className="filter-input"
            type="number"
            name="semester"
            placeholder="Semester"
            value={filters.semester}
            onChange={handleInputChange}
            min="1"
            max="8"
          />
        </div>

        <div className="filter-group">
          <input
            className="filter-input"
            type="text"
            name="subject"
            placeholder="Subject"
            value={filters.subject}
            onChange={handleInputChange}
          />
        </div>

        <button className="search-btn" type="submit" disabled={loading}>
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </form>

      <ProfessorList professors={professors} />
    </div>
  )
}
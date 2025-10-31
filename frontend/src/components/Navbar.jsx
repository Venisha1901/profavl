import { Link } from "react-router-dom"
import "./Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <h1 className="navbar-title">Professor Availability Portal</h1>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/stats" className="nav-link">
            Stats
          </Link>
        </div>
      </div>
    </nav>
  )
}
import ProfessorCard from "./ProfessorCard"
import "./ProfessorList.css"

export default function ProfessorList({ professors }) {
  if (!professors.length) {
    return (
      <div className="professor-list-empty">
        <p>No professors found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="professor-list-container">
      {professors.map((prof) => (
        <ProfessorCard key={prof._id} professor={prof} />
      ))}
    </div>
  )
}
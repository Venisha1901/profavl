import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandPage from "./pages/LandPage";
import BookVisit from "./pages/BookVisit";
import Stats from "./pages/Stats";
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/stats">Stats</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/book" element={<BookVisit />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

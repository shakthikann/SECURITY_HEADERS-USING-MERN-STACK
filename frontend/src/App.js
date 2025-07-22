import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Scan from "./Scan";
import Recent from "./Recent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/recent" element={<Recent />} />
      </Routes>
    </Router>
  );
}

export default App;
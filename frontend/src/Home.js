import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [recent, setRecent] = useState([]);
  const [fame, setFame] = useState([]);
  const [shame, setShame] = useState([]);
  const navigate = useNavigate();

  const handleScan = () => {
    if (!domain.trim()) {
      alert("Please enter a valid domain name");
      return;
    }
    localStorage.setItem("domain", domain);
    navigate("/scan");
  };

  const handleLinkClick = (domain) => {
    localStorage.setItem("domain", domain);
    navigate("/scan");
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/recent").then((res) => setRecent(res.data));
    axios.get("http://localhost:5000/api/hall").then((res) => {
      setFame(res.data.fame);
      setShame(res.data.shame);
    });
  }, []);

  const renderCard = (title, data) => (
    <div style={{
      flex: 1,
      background: "#ffffff",
      padding: "1rem",
      margin: "0.5rem",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#003366", fontSize: "1.2rem", marginBottom: "0.8rem" }}>{title}</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {data.map((s, i) => (
          <li key={i}>
            <a
              href="#"
              onClick={() => handleLinkClick(s.domain)}
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              {s.domain} -{" "}
              <span style={{
                color:
                  s.grade === "A+" ? "#007F00" :
                    s.grade === "A" ? "#4CAF50" :
                      s.grade === "B" ? "#FF9800" :
                        s.grade === "C" ? "#FFC107" :
                          "#F44336"
              }}>{s.grade}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ background: "#f0f7ff", minHeight: "100vh", fontFamily: "Segoe UI", padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="/download.jpg" alt="logo" style={{ width: "60px", verticalAlign: "middle", marginRight: "10px" }} />
        <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#003366", verticalAlign: "middle" }}>
          Security Headers
        </span>
        <p style={{ fontSize: "2rem", marginTop: "1rem", fontWeight: "bold" ,color: "#003366" }}>
          Scan your site now
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          placeholder="Enter address here"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            padding: "0.8rem",
            width: "300px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px"
          }}
        />
        <button
          onClick={handleScan}
          style={{
            padding: "0.8rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Scan
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        {renderCard("Recent Scans", recent)}
        {renderCard("Hall of Fame", fame)}
        {renderCard("Hall of Shame", shame)}
      </div>
    </div>
  );
}
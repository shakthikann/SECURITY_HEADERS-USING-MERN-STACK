import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Scan() {
  const [result, setResult] = useState(null);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const storedDomain = localStorage.getItem("domain");
    setDomain(storedDomain);

    axios
      .post("http://localhost:5000/api/scan", { domain: storedDomain })
      .then((res) => setResult(res.data))
      .catch(() =>
        alert("Failed to scan the domain. Please check the domain name.")
      );
  }, []);

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+": return "#006400";
      case "A": return "#32CD32";
      case "B": return "#FFD700";
      case "C": return "#FFA500";
      case "D": return "#FFB6C1";
      case "F": return "#DC143C";
      default: return "#888";
    }
  };

  if (!result) return <p style={{ padding: "2rem" }}>Scanning {domain}...</p>;

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "2rem", fontSize: "0.85rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.2rem" }}>
        Security Report Summary
      </h2>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "1rem 1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              backgroundColor: getGradeColor(result.grade),
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
            }}
          >
            {result.grade}
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            <p><strong>Site:</strong> <a href={result.domain} target="_blank" rel="noopener noreferrer">{result.domain}</a></p>
            <p><strong>IP Address:</strong> {result.ip}</p>
            <p><strong>Report Time:</strong> {new Date(result.time).toLocaleString()}</p>
          </div>
        </div>

        <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Headers</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.6rem",
            fontSize: "0.75rem",
          }}
        >
          {Object.entries(result.headers).map(([header, value]) => (
            <div
              key={header}
              style={{
                backgroundColor: value ? "#d4edda" : "#f8d7da",
                padding: "0.5rem",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{header}</span>
              <span style={{ fontWeight: "bold", color: value ? "green" : "red" }}>
                {value ? "✔" : "❌"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
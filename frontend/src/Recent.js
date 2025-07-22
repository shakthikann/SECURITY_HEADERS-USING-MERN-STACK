import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Recent() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/recent").then((res) => setScans(res.data));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Recent Scans</h2>
      <ul>
        {scans.map((s, i) => (
          <li key={i}>{s.domain} - Grade: {s.grade}</li>
        ))}
      </ul>
    </div>
  );
}
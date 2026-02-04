const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const app = express();

// =====================
// CONFIG
// =====================
const API_KEY = "8e825b0645b7463c1e08ceafc2e16b487b652e8901744a65dd04026207afa2d5";
const API_BASE = "https://v3.football.api-sports.io";

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// FRONTEND (STATIC)
// =====================
app.use(express.static(path.join(__dirname, "goalguide-app")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "goalguide-app", "index.html"));
});

// =====================
// API: LIVE MATCHES
// =====================
app.get("/api/live", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}/fixtures?live=all`, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });

    const data = await response.json();
    res.json(data.response);
  } catch (err) {
    res.status(500).json({ error: "Live API error" });
  }
});

// =====================
// API: FIXTURES (TODAY / TOMORROW)
// ?date=2026-02-04
// =====================
app.get("/api/fixtures", async (req, res) => {
  try {
    const { date } = req.query;

    const response = await fetch(
      `${API_BASE}/fixtures?date=${date}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();
    res.json(data.response);
  } catch (err) {
    res.status(500).json({ error: "Fixtures API error" });
  }
});

// =====================
// API: MATCH DETAIL
// =====================
app.get("/api/match/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `${API_BASE}/fixtures?id=${id}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();
    res.json(data.response[0]);
  } catch (err) {
    res.status(500).json({ error: "Match detail API error" });
  }
});

// =====================
// 404
// =====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

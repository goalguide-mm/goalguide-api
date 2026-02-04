const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// =====================
// CONFIG
// =====================
const API_KEY = process.env.API_KEY || "YOUR_API_KEY_HERE";
const API_BASE = "https://v3.football.api-sports.io";

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROOT (API STATUS)
// =====================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "GOAL GUIDE API is running 🚀"
  });
});

// =====================
// LIVE MATCHES
// =====================
app.get("/api/live", async (req, res) => {
  try {
    const r = await fetch(`${API_BASE}/fixtures?live=all`, {
      headers: { "x-apisports-key": API_KEY }
    });
    const data = await r.json();
    res.json(data.response);
  } catch (e) {
    res.status(500).json({ error: "Live API error" });
  }
});

// =====================
// FIXTURES BY DATE
// /api/fixtures?date=2026-02-04
// =====================
app.get("/api/fixtures", async (req, res) => {
  try {
    const { date } = req.query;
    const r = await fetch(`${API_BASE}/fixtures?date=${date}`, {
      headers: { "x-apisports-key": API_KEY }
    });
    const data = await r.json();
    res.json(data.response);
  } catch (e) {
    res.status(500).json({ error: "Fixtures API error" });
  }
});

// =====================
// MATCH DETAIL
// =====================
app.get("/api/match/:id", async (req, res) => {
  try {
    const r = await fetch(
      `${API_BASE}/fixtures?id=${req.params.id}`,
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );
    const data = await r.json();
    res.json(data.response[0]);
  } catch (e) {
    res.status(500).json({ error: "Match API error" });
  }
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ API running on port", PORT);
});

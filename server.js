const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

// =====================
// CONFIG
// =====================
const API_KEY =
  "8e825b0645b7463c1e08ceafc2e16b487b652e8901744a65dd04026207afa2d5";
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

// =====================
// ROOT → index.html
// =====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "goalguide-app", "index.html"));
});

// =====================
// LIVE MATCHES
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
    res.status(500).json({ error: "Live matches fetch failed" });
  }
});

// =====================
// FIXTURES
// ?date=2026-02-04
// =====================
app.get("/api/fixtures", async (req, res) => {
  const date = req.query.date;

  try {
    const response = await fetch(
      `${API_BASE}/fixtures${date ? `?date=${date}` : ""}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();
    res.json(data.response);
  } catch (err) {
    res.status(500).json({ error: "Fixtures fetch failed" });
  }
});

// =====================
// MATCH DETAIL
// =====================
app.get("/api/match/:id", async (req, res) => {
  try {
    const response = await fetch(
      `${API_BASE}/fixtures?id=${req.params.id}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();
    res.json(data.response[0]);
  } catch (err) {
    res.status(500).json({ error: "Match detail fetch failed" });
  }
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ GOAL GUIDE API running on http://localhost:${PORT}`);
});

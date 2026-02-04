const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// FRONTEND (STATIC FILES)
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
app.get("/api/live", (req, res) => {
  res.json([
    {
      id: 1001,
      league: "Premier League",
      home: "Liverpool",
      away: "Man United",
      status: "LIVE",
      minute: 67,
      homeScore: 1,
      awayScore: 0
    }
  ]);
});

// =====================
// FIXTURES
// =====================
app.get("/api/fixtures", (req, res) => {
  res.json([
    {
      id: 1,
      league: "Premier League",
      home: "Arsenal",
      away: "Chelsea",
      status: "LIVE",
      homeScore: 2,
      awayScore: 1,
      day: 0
    }
  ]);
});

// =====================
// MATCH DETAIL
// =====================
app.get("/api/match/:id", (req, res) => {
  res.json({
    id: req.params.id,
    league: "Premier League",
    home: "Arsenal",
    away: "Chelsea",
    status: "LIVE",
    homeScore: 2,
    awayScore: 1
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

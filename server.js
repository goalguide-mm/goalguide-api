const express = require("express");
const cors = require("cors");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROOT CHECK
// =====================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Goal Guide API is running 🚀"
  });
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
  console.log(`✅ Server running on port ${PORT}`);
});

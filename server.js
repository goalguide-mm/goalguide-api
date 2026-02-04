const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// =========================
// TEST
// =========================
app.get("/", (req, res) => {
  res.send("Goal Guide API is running ✅");
});

// =========================
// FIXTURES (Today / Tomorrow)
// =========================
app.get("/api/fixtures", (req, res) => {
  res.json({
    today: [
      {
        id: 1,
        league: "Premier League",
        home: "Liverpool",
        away: "Man United",
        time: "22:30",
        status: "UPCOMING"
      }
    ],
    tomorrow: [
      {
        id: 2,
        league: "La Liga",
        home: "Barcelona",
        away: "Real Madrid",
        time: "01:00",
        status: "UPCOMING"
      }
    ]
  });
});

// =========================
// LIVE MATCHES
// =========================
app.get("/api/live", (req, res) => {
  res.json([
    {
      id: 3,
      league: "Serie A",
      home: "Inter",
      away: "AC Milan",
      minute: 67,
      score: "1 - 0",
      status: "LIVE"
    }
  ]);
});

// =========================
// RESULTS (Yesterday)
// =========================
app.get("/api/results", (req, res) => {
  res.json({
    yesterday: [
      {
        id: 4,
        league: "Premier League",
        home: "Arsenal",
        away: "Chelsea",
        score: "2 - 1",
        status: "FT"
      }
    ]
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

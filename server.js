const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// =====================
// ROOT
// =====================
app.get("/", (req, res) => {
  res.send("GOAL GUIDE API is running ✅");
});

// =====================
// LIVE MATCHES
// =====================
app.get("/api/live", (req, res) => {
  res.json([
    {
      id: 1001,
      league: "Premier League",
      leagueLogo:
        "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
      home: "Liverpool",
      homeLogo:
        "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      away: "Man United",
      awayLogo:
        "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      status: "LIVE",
      minute: 67,
      homeScore: 1,
      awayScore: 0
    }
  ]);
});

// =====================
// FIXTURES (TODAY / TOMORROW)
// =====================
app.get("/api/fixtures", (req, res) => {
  const day = Number(req.query.day); // 0 = today, 1 = tomorrow

  res.json([
    {
      id: 12345,
      league: "Premier League",
      leagueLogo:
        "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
      home: "Arsenal",
      homeLogo:
        "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      away: "Chelsea",
      awayLogo:
        "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
      status: day === 1 ? "NS" : "LIVE",
      minute: day === 1 ? null : 54,
      homeScore: day === 1 ? 0 : 2,
      awayScore: day === 1 ? 0 : 1
    }
  ]);
});

// =====================
// RESULTS
// =====================
app.get("/api/results", (req, res) => {
  res.json([
    {
      id: 2001,
      league: "Premier League",
      home: "Man City",
      away: "Spurs",
      score: "3 - 1"
    }
  ]);
});

// =====================
// MATCH DETAIL
// =====================
app.get("/api/match/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    id,
    league: "Premier League",
    leagueLogo:
      "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
    home: "Arsenal",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    away: "Chelsea",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    status: "LIVE",
    minute: 72,
    homeScore: 2,
    awayScore: 1,
    stadium: "Emirates Stadium"
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("GOAL GUIDE API running on port", PORT);
});

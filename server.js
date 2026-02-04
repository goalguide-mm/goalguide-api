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
  res.json([
    {
      id: 1,
      league: "Premier League",
      leagueLogo: "https://...",
      home: "Arsenal",
      homeLogo: "https://...",
      away: "Chelsea",
      awayLogo: "https://...",
      status: "LIVE",
      minute: 54,
      homeScore: 2,
      awayScore: 1,
      day: 0
    },
    {
      id: 2,
      league: "Premier League",
      home: "Liverpool",
      away: "Man United",
      status: "FT",
      homeScore: 3,
      awayScore: 1,
      day: -1
    },
    {
      id: 3,
      league: "Premier League",
      home: "Man City",
      away: "Spurs",
      status: "NS",
      homeScore: 0,
      awayScore: 0,
      day: 0
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

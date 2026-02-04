const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// FRONTEND (STATIC FILES)
// =====================
// index.html ရှိတဲ့ folder နာမည်
app.use(express.static(path.join(__dirname, "goalguide-app")));

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
// FIXTURES
// =====================
app.get("/api/fixtures", (req, res) => {
  const day = Number(req.query.day);

  const matches = [
    {
      id: 1,
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
    },
    {
      id: 4,
      league: "Premier League",
      home: "Newcastle",
      away: "Arsenal",
      status: "NS",
      homeScore: 0,
      awayScore: 0,
      day: 1
    }
  ];

  if (isNaN(day)) {
    return res.json(matches);
  }

  res.json(matches.filter(m => m.day === day));
});

// =====================
// MATCH DETAIL
// =====================
app.get("/api/match/:id", (req, res) => {
  res.json({
    id: req.params.id,
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
// 404 HANDLER (API)
// =====================
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("GOAL GUIDE running on http://localhost:" + PORT);
});

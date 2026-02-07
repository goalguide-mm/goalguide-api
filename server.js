const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const API_TOKEN = "W3FI2JepFynSaW5J1fuzuDyMcWVbJTV7kWhGSdm2hGbpo4WUAYFsC6eh0Mrd";

app.get("/", (req, res) => {
  res.send("GoalGuide API is running 🚀");
});

// ၁။ Today Matches
app.get('/api/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const r = await fetch(`https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${API_TOKEN}&include=participants;league;scores;state`);
        const data = await r.json();
        res.json(data.data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ၂။ Fixtures by Date
app.get("/api/fixtures/date/:date", async (req, res) => {
  const date = req.params.date; 
  try {
    const r = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${API_TOKEN}&include=participants;league;state;scores`
    );
    const data = await r.json();
    res.json(data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ၃။ Match Lineup/Detail (HTML ထဲက ခေါ်မည့် endpoint)
app.get("/api/fixtures/:id", async (req, res) => {
  const matchId = req.params.id;
  try {
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/${matchId}?api_token=${API_TOKEN}&include=participants;lineups.player;formations`
    );
    const data = await response.json();
    res.json(data.data || {});
  } catch (error) {
    res.status(500).json({ error: "Lineup fetch failed" });
  }
});

// ၄။ Standings
app.get("/api/standings", async (req, res) => {
  try {
    const r = await fetch(`https://api.sportmonks.com/v3/football/standings/live/leagues/8?api_token=${API_TOKEN}`);
    const data = await r.json();
    res.json(data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ၅။ Highlights API
app.get('/api/highlights', async (req, res) => {
  try {
    const response = await fetch('https://www.scorebat.com/video-api/v3/');
    const data = await response.json();
    res.json(data.response || []); 
  } catch (error) {
    res.status(500).json({ error: "Highlight fetch failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

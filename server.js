const express = require("express");
const axios = require("axios"); // node-fetch အစား axios သုံးတာက ပိုစိတ်ချရပါတယ်
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// သင်ပေးထားတဲ့ Sportmonks API Token
const API_TOKEN = "W3FI2JepFynSaW5J1fuzuDyMcWVbJTV7kWhGSdm2hGbpo4WUAYFsC6eh0Mrd";

app.get("/", (req, res) => {
  res.send("GoalGuide API is running 🚀");
});

// ၁။ Today Matches (ယနေ့ပွဲစဉ်များ)
app.get('/api/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const url = `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${API_TOKEN}&include=participants;league;scores;state`;
        const response = await axios.get(url);
        res.json(response.data.data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ၂။ Fixtures by Date (ရက်စွဲအလိုက် ပွဲစဉ်များ)
app.get("/api/fixtures/date/:date", async (req, res) => {
  const date = req.params.date; 
  try {
    const url = `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${API_TOKEN}&include=participants;league;state;scores`;
    const response = await axios.get(url);
    res.json(response.data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ၃။ Match Lineup (လူစာရင်း အသေးစိတ်)
app.get("/api/fixtures/:id", async (req, res) => {
  const matchId = req.params.id;
  try {
    const url = `https://api.sportmonks.com/v3/football/fixtures/${matchId}?api_token=${API_TOKEN}&include=participants;lineups.player;formations`;
    const response = await axios.get(url);
    res.json(response.data.data || {});
  } catch (error) {
    res.status(500).json({ error: "Lineup fetch failed" });
  }
});

// ၄။ Standings (မှတ်တမ်းဇယား - Premier League ID: 8 အား အခြေခံထားသည်)
app.get("/api/standings", async (req, res) => {
  try {
    const url = `https://api.sportmonks.com/v3/football/standings/live/leagues/8?api_token=${API_TOKEN}`;
    const response = await axios.get(url);
    res.json(response.data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ၅။ Highlights API (ScoreBat မှ Video များ)
app.get('/api/highlights', async (req, res) => {
  try {
    const response = await axios.get('https://www.scorebat.com/video-api/v3/feed/?token=MTc5MDU0XzE3Mzg5MTM1ODZfNGU5YjA3ZGE1YjU1MmFkYjQ5ZTkzZjc0N2U2YmFmYjBkYmNmMDdhYg==');
    res.json(response.data.response || []); 
  } catch (error) {
    res.status(500).json({ error: "Highlight fetch failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

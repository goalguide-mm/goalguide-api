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

// ၁။ Live Scores - လက်ရှိကန်နေသောပွဲများ
app.get("/api/live", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.sportmonks.com/v3/football/livescores?api_token=${API_TOKEN}&include=participants;league;state`
    );
    const data = await r.json();
    res.json(data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ၂။ Fixtures by Date - ရက်စွဲအလိုက် ပွဲစဉ်များ
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

// ၃။ Today Matches
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

// ၄။ Match Detail - ပွဲစဉ်အသေးစိတ်
app.get("/api/match/:id", async (req, res) => {
  const matchId = req.params.id;
  try {
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/${matchId}?api_token=${API_TOKEN}&include=participants;events;statistics;scores`
    );
    const data = await response.json();
    res.json(data.data || {});
  } catch (error) {
    res.status(500).json({ error: "API fetch failed" });
  }
});

// --- ၅။ Highlights API (ScoreBat) ---
// ဤအပိုင်းသည် Real Highlight ဗီဒီယိုများကို ဆွဲထုတ်ပေးမည်ဖြစ်သည်
app.get('/api/highlights', async (req, res) => {
  try {
    const response = await fetch('https://www.scorebat.com/video-api/v3/');
    const data = await response.json();
    // ScoreBat မှရလာသော နောက်ဆုံးရ Highlight များကို JSON ပုံစံဖြင့် ပြန်ပို့ပေးခြင်း
    res.json(data.response || []); 
  } catch (error) {
    res.status(500).json({ error: "Highlight fetch failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

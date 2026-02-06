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

// ၂။ Fixtures by Date - ရက်စွဲအလိုက် ပွဲစဉ်များ (ပြီးခဲ့သောပွဲ + နောက်လာမည့်ပွဲ အကုန်ရသည်)
app.get("/api/fixtures/date/:date", async (req, res) => {
  const date = req.params.date; // format: YYYY-MM-DD
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

// server.js ထဲမှာ ဒီ route လေးကို ပေါင်းထည့်ပေးပါ
app.get('/api/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // ရှိပြီးသား fixtures function ကို ပြန်သုံးပြီး ဒီနေ့ရက်စွဲနဲ့ ခေါ်ခိုင်းတာပါ
        const response = await axios.get(`${SPORTMONKS_URL}/fixtures/date/${today}?api_token=${API_TOKEN}&include=participants;league;scores;state`);
        res.json(response.data.data);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

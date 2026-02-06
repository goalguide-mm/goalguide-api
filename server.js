const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS ကို အသုံးပြုခွင့်ပေးရန်
app.use(cors());

// သင့်ရဲ့ Sportmonks API Token
const API_TOKEN = "W3FI2JepFynSaW5J1fuzuDyMcWVbJTV7kWhGSdm2hGbpo4WUAYFsC6eh0Mrd";

app.get("/", (req, res) => {
  res.send("GoalGuide API is running 🚀");
});

// Live Scores Endpoint
app.get("/api/live", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.sportmonks.com/v3/football/livescores?api_token=${API_TOKEN}`
    );
    const data = await r.json();
    res.json(data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Today Fixtures Endpoint
app.get("/api/fixtures/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const r = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${API_TOKEN}&include=participants`
    );
    const data = await r.json();
    res.json(data.data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Match Details Endpoint
app.get("/api/match/:id", async (req, res) => {
  const matchId = req.params.id;
  try {
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/${matchId}?api_token=${API_TOKEN}&include=participants;events;statistics`
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

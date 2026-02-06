const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors"); // ၁။ CORS ကို ခေါ်ယူပါ

const app = express();
const PORT = process.env.PORT || 3000;

// ၂။ CORS Middleware ကို အသုံးပြုပါ (ဒါမှ Website က data လှမ်းတောင်းလို့ ရမှာပါ)
app.use(cors());

// Sportmonks Token
const API_TOKEN = "W3FI2JepFynSaW5J1fuzuDyMcWVbJTV7kWhGSdm2hGbpo4WUAYFsC6eh0Mrd";

app.get("/", (req, res) => {
  res.send("GoalGuide API is running 🚀");
});

// Match Detail Route (Sportmonks format ပြင်ထားသည်)
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

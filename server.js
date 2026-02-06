const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// သင်ပေးထားသော API Key ကို ဤနေရာတွင် ထည့်ထားပါသည်
const API_KEY = "8e825b0645b7463c1e08ceafc2e16b487b652e8901744a65dd04026207afa2d5";
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io"
};

app.get("/", (req, res) => res.send("GoalGuide API Sports is running 🚀"));

// ၁။ Live Scores
app.get("/api/live", async (req, res) => {
    try {
        const r = await fetch(`${BASE_URL}/fixtures?live=all`, { headers });
        const data = await r.json();
        res.json(data.response || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ၂။ ရက်စွဲအလိုက် ပွဲစဉ်များ (Results & Fixtures)
app.get("/api/fixtures/date/:date", async (req, res) => {
    try {
        const r = await fetch(`${BASE_URL}/fixtures?date=${req.params.date}`, { headers });
        const result = await r.json();
        
        // Console မှာ data ကျမကျ အရင်စစ်မယ်
        console.log("API Response Status:", result.results); 
        
        // response ဆိုတဲ့ အထဲမှာ data ရှိမှ ပို့မယ်
        res.json(result.response || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const API_KEY = "8e825b0645b7463c1e08ceafc2e16b487b652e8901744a65dd04026207afa2d5";
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io"
};

app.get("/", (req, res) => res.send("GoalGuide API is Active 🚀"));

// Live ပွဲစဉ်များ (Premier League ကို ဦးစားပေးရှာမည်)
app.get("/api/live", async (req, res) => {
    try {
        const r = await fetch(`${BASE_URL}/fixtures?live=all&league=39`, { headers });
        const data = await r.json();
        res.json(data.response || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ရက်စွဲအလိုက် (Premier League ပွဲစဉ်များသာ)
app.get("/api/fixtures/date/:date", async (req, res) => {
    try {
        const r = await fetch(`${BASE_URL}/fixtures?date=${req.params.date}&league=39&season=2025`, { headers });
        const data = await r.json();
        res.json(data.response || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`Server is running`));

const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const API_KEY = "8e825b0645b7463c1e08ceafc2e16b487b652e8901744a65dd04026207afa2d5";
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io"
};

app.get("/", (req, res) => res.send("GoalGuide API is Online 🚀"));

// Live Matches
app.get("/api/live", async (req, res) => {
    try {
        const r = await fetch(`${BASE_URL}/fixtures?live=all`, { headers });
        const data = await r.json();
        res.json(data.response || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Matches by Date (YYYY-MM-DD)
app.get("/api/fixtures/date/:date", async (req, res) => {
    try {
        const r = await fetch(`${BASE_URL}/fixtures?date=${req.params.date}`, { headers });
        const data = await r.json();
        res.json(data.response || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

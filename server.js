const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Sportmonks Key ကို ဤနေရာတွင် ပြန်သုံးထားသည်
const SPORTMONKS_KEY = "vE8zY78pP70N36jSgMszS8D081e7E4O9u6mO8K293p1d8M9O60p89M9p8O6p";

app.get("/", (req, res) => res.send("Sportmonks API is Online 🚀"));

// Today's Matches (Denmark Superliga)
app.get("/api/today", async (req, res) => {
    try {
        const r = await fetch(`https://api.sportmonks.com/v3/football/fixtures?api_token=${SPORTMONKS_KEY}&include=participants;league;scores`);
        const data = await r.json();
        res.json(data.data || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

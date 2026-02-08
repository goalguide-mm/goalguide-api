const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const RAPID_API_KEY = "1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414";
const RAPID_API_HOST = "sportapi7.p.rapidapi.com";

let cacheData = {
    fixtures: {},
    standings: null,
    highlights: null,
    lastFetch: { fixtures: {}, standings: 0, highlights: 0 }
};

const CACHE_TIME = 15 * 60 * 1000;

// Fixtures Route
app.get("/api/fixtures/date/:date", async (req, res) => {
    const date = req.params.date;
    const now = Date.now();

    if (cacheData.fixtures[date] && (now - cacheData.lastFetch.fixtures[date] < CACHE_TIME)) {
        return res.json(cacheData.fixtures[date]);
    }

    try {
        const options = {
            method: 'GET',
            url: `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${date}`,
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
        };
        const response = await axios.request(options);
        const events = response.data.events || [];

        const processedEvents = events.map(ev => ({
            ...ev,
            isStarted: ev.status?.type !== "notstarted"
        }));
        
        cacheData.fixtures[date] = processedEvents;
        cacheData.lastFetch.fixtures[date] = now;
        res.json(processedEvents);
    } catch (e) {
        console.error("Fixture Error:", e.message);
        res.json([]);
    }
});

// Standings Route (အမှတ်ပေးဇယားအတွက် အဓိကပြင်ဆင်ချက်)
app.get("/api/standings", async (req, res) => {
    const now = Date.now();
    if (cacheData.standings && (now - cacheData.lastFetch.standings < CACHE_TIME)) {
        return res.json(cacheData.standings);
    }
    try {
        const options = {
            method: 'GET',
            url: 'https://sportapi7.p.rapidapi.com/api/v1/tournament/8/season/61627/standings/total',
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
        };
        const response = await axios.request(options);
        
        // API response ကို သေချာစစ်ဆေးပြီး ပထမဆုံး standing data ကို ပို့ပေးခြင်း
        const stData = response.data.standings;
        if (stData && Array.isArray(stData) && stData.length > 0) {
            cacheData.standings = stData[0]; // rows ပါဝင်သော object ကိုယူသည်
        } else {
            cacheData.standings = { rows: [] };
        }

        cacheData.lastFetch.standings = now;
        res.json(cacheData.standings);
    } catch (error) {
        console.error("Standings Error:", error.message);
        res.status(500).json({ error: "Failed to fetch standings", rows: [] });
    }
});

// Highlights Route
app.get('/api/highlights', async (req, res) => {
    const now = Date.now();
    if (cacheData.highlights && (now - cacheData.lastFetch.highlights < CACHE_TIME)) {
        return res.json(cacheData.highlights);
    }
    try {
        const response = await axios.get('https://www.scorebat.com/video-api/v3/');
        const hData = response.data.response ? response.data.response.slice(0, 15) : [];
        cacheData.highlights = hData;
        cacheData.lastFetch.highlights = now;
        res.json(hData);
    } catch (error) {
        res.json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running..."));

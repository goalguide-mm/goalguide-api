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
        res.json([]);
    }
});

// Standings Route (ဒီနေရာကို သေချာစစ်ပါ)
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
        
        // API ကလာတဲ့ data ထဲက standings array ထဲက ပထမဆုံးတစ်ခုကို ယူပါတယ်
        const standingsArr = response.data.standings || [];
        const result = standingsArr.length > 0 ? standingsArr[0] : null;

        cacheData.standings = result;
        cacheData.lastFetch.standings = now;
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
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
        const data = response.data.response.slice(0, 15);
        cacheData.highlights = data;
        cacheData.lastFetch.highlights = now;
        res.json(data);
    } catch (error) {
        res.json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running..."));

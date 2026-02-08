const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const RAPID_API_KEY = "1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414";
const RAPID_API_HOST = "sportapi7.p.rapidapi.com";

// Cache သိမ်းဖို့ Memory တစ်ခု တည်ဆောက်ခြင်း
let cacheData = {
    fixtures: {},
    standings: null,
    highlights: null,
    lastFetch: { fixtures: {}, standings: 0, highlights: 0 }
};

const CACHE_TIME = 15 * 60 * 1000; // ၁၅ မိနစ် (မီလီစက္ကန့်ဖြင့်)

// Fixtures with Caching
app.get("/api/fixtures/date/:date", async (req, res) => {
    const date = req.params.date;
    const now = Date.now();

    // Cache ထဲမှာ ဒေတာရှိပြီး ၁၅ မိနစ် မကျော်သေးရင် အဲဒါကိုပဲ ပြမယ်
    if (cacheData.fixtures[date] && (now - cacheData.lastFetch.fixtures[date] < CACHE_TIME)) {
        console.log(`Serving from Cache for date: ${date}`);
        return res.json(cacheData.fixtures[date]);
    }

    try {
        console.log(`Fetching from API for date: ${date}`);
        const options = {
            method: 'GET',
            url: `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${date}`,
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
        };
        const response = await axios.request(options);
        const matchData = response.data.events || [];
        
        // Cache ထဲ သိမ်းထားလိုက်ခြင်း
        cacheData.fixtures[date] = matchData;
        cacheData.lastFetch.fixtures[date] = now;

        res.json(matchData);
    } catch (e) {
        // Error တက်ရင်လည်း အရင်ရှိပြီးသား Cache ကိုပဲ ပြပေးမယ် (မရှိရင် [] ပြမယ်)
        res.json(cacheData.fixtures[date] || []);
    }
});

// Standings with Caching
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
        cacheData.standings = response.data.standings || [];
        cacheData.lastFetch.standings = now;
        res.json(cacheData.standings);
    } catch (error) { res.json(cacheData.standings || []); }
});

// Highlights (ScoreBat API က Limit သိပ်မရှိလို့ Cache သုံးတာ ပိုမြန်စေတယ်)
app.get('/api/highlights', async (req, res) => {
    const now = Date.now();
    if (cacheData.highlights && (now - cacheData.lastFetch.highlights < CACHE_TIME)) {
        return res.json(cacheData.highlights);
    }
    try {
        const response = await axios.get('https://www.scorebat.com/video-api/v3/');
        cacheData.highlights = response.data.response.slice(0, 15);
        cacheData.lastFetch.highlights = now;
        res.json(cacheData.highlights);
    } catch (error) { res.json(cacheData.highlights || []); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server with Caching is running..."));

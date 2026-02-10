const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const FOOTBALL_DATA_KEY = "c8c972ee26be439581c583f3d2d5f9cd";
const CACHE_TIME = 10 * 60 * 1000; // Cache ကို ၁၀ မိနစ်အထိ တိုးထားလိုက်ပါ (API limit မပြည့်စေရန်)
let cacheData = { fixtures: {}, standings: {}, lastFetch: { fixtures: {}, standings: {} } };

// API ခေါ်ယူမှုအတွက် တူညီသော configuration ကို သုံးပါမည်
const apiConfig = {
    headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
    timeout: 30000 // ၃၀ စက္ကန့်အထိ တိုးလိုက်ပါ (Free Server အတွက် ပိုစိတ်ချရသည်)
};

// --- ၁။ ပွဲစဉ်များ (Fixtures) ---
app.get("/api/fixtures/date/:date", async (req, res) => {
    const requestedDate = req.params.date;
    const now = Date.now();

    if (cacheData.fixtures[requestedDate] && (now - cacheData.lastFetch.fixtures[requestedDate] < CACHE_TIME)) {
        console.log(`Serving fixtures from cache for: ${requestedDate}`);
        return res.json(cacheData.fixtures[requestedDate]);
    }

    try {
        const url = `https://api.football-data.org/v4/matches?dateFrom=${requestedDate}&dateTo=${requestedDate}`;
        const response = await axios.get(url, apiConfig);

        const matches = response.data.matches || [];
        const processedEvents = matches.map(match => ({
            homeTeam: { name: match.homeTeam.shortName || match.homeTeam.name, id: match.homeTeam.id },
            awayTeam: { name: match.awayTeam.shortName || match.awayTeam.name, id: match.awayTeam.id },
            homeScore: { display: match.score.fullTime.home !== null ? match.score.fullTime.home : "-" },
            awayScore: { display: match.score.fullTime.away !== null ? match.score.fullTime.away : "-" },
            startTimestamp: new Date(match.utcDate).getTime() / 1000,
            status: { type: match.status === "IN_PLAY" || match.status === "LIVE" ? "inprogress" : "notstarted" },
            tournament: { name: match.competition.name }
        }));

        cacheData.fixtures[requestedDate] = processedEvents;
        cacheData.lastFetch.fixtures[requestedDate] = now;
        res.json(processedEvents);

    } catch (e) {
        console.error("Fixture API Error:", e.message);
        // Error ဖြစ်ခဲ့ရင် Cache ရှိရင် ပြန်ပေးမယ်၊ မရှိရင် အလွတ်ပြန်ပေးမယ်
        res.json(cacheData.fixtures[requestedDate] || []);
    }
});

// --- ၂။ Standings (အမှတ်ပေးဇယား) ---
app.get("/api/standings/:leagueCode", async (req, res) => {
    const leagueCode = req.params.leagueCode || "PL";
    const now = Date.now();

    if (cacheData.standings[leagueCode] && (now - cacheData.lastFetch.standings[leagueCode] < CACHE_TIME)) {
        return res.json(cacheData.standings[leagueCode]);
    }

    try {
        const url = `https://api.football-data.org/v4/competitions/${leagueCode}/standings`;
        const response = await axios.get(url, apiConfig);
        
        const standings = response.data.standings[0].table.map(team => ({
            position: team.position,
            teamName: team.team.shortName || team.team.name,
            played: team.playedGames,
            won: team.won,
            draw: team.draw,
            lost: team.lost,
            points: team.points,
            goalDifference: team.goalDifference
        }));

        cacheData.standings[leagueCode] = standings;
        cacheData.lastFetch.standings[leagueCode] = now;
        res.json(standings);

    } catch (e) {
        console.error("Standings API Error:", e.message);
        res.json(cacheData.standings[leagueCode] || []);
    }
});

app.get("/api/highlights", (req, res) => res.json([]));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Football-Data API Key is active.`);
});

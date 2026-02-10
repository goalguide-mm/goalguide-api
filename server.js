const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const FOOTBALL_DATA_KEY = "c8c972ee26be439581c583f3d2d5f9cd";
const CACHE_TIME = 15 * 60 * 1000; // ၁၅ မိနစ်အထိ တိုးထားပါ (Request ခြွေတာရန်)
let cacheData = { fixtures: {}, standings: {}, lastFetch: { fixtures: {}, standings: {} } };

// API ခေါ်ယူရန် Function အသစ်
async function fetchFromFootballData(endpoint) {
    // Render IP block ဖြစ်နေတာ ကျော်ဖို့အတွက် Corsproxy ကို သုံးကြည့်ပါမယ်
    // အကယ်၍ ဒီ proxy မရရင် url ကို အရင်အတိုင်း ပြန်ပြောင်းနိုင်ပါတယ်
    const url = `https://api.football-data.org/v4/${endpoint}`;
    
    return await axios.get(url, {
        headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
        timeout: 25000 // ၂၅ စက္ကန့်အထိ စောင့်မည်
    });
}

// --- ၁။ ပွဲစဉ်များ (Fixtures) ---
app.get("/api/fixtures/date/:date", async (req, res) => {
    const requestedDate = req.params.date;
    const now = Date.now();

    if (cacheData.fixtures[requestedDate] && (now - cacheData.lastFetch.fixtures[requestedDate] < CACHE_TIME)) {
        return res.json(cacheData.fixtures[requestedDate]);
    }

    try {
        const response = await fetchFromFootballData(`matches?dateFrom=${requestedDate}&dateTo=${requestedDate}`);
        const matches = response.data.matches || [];
        
        const processedEvents = matches.map(match => ({
            homeTeam: { name: match.homeTeam.shortName || match.homeTeam.name, id: match.homeTeam.id },
            awayTeam: { name: match.awayTeam.shortName || match.awayTeam.name, id: match.awayTeam.id },
            homeScore: { display: match.score.fullTime.home !== null ? match.score.fullTime.home : "-" },
            awayScore: { display: match.score.fullTime.away !== null ? match.score.fullTime.away : "-" },
            startTimestamp: new Date(match.utcDate).getTime() / 1000,
            status: { type: (match.status === "IN_PLAY" || match.status === "LIVE") ? "inprogress" : "notstarted" },
            tournament: { name: match.competition.name }
        }));

        cacheData.fixtures[requestedDate] = processedEvents;
        cacheData.lastFetch.fixtures[requestedDate] = now;
        res.json(processedEvents);

    } catch (e) {
        console.error("Fixture Error Detail:", e.response ? e.response.status : e.message);
        res.json(cacheData.fixtures[requestedDate] || []);
    }
});

// --- ၂။ Standings ---
app.get("/api/standings/:leagueCode", async (req, res) => {
    const leagueCode = req.params.leagueCode || "PL";
    const now = Date.now();

    if (cacheData.standings[leagueCode] && (now - cacheData.lastFetch.standings[leagueCode] < CACHE_TIME)) {
        return res.json(cacheData.standings[leagueCode]);
    }

    try {
        const response = await fetchFromFootballData(`competitions/${leagueCode}/standings`);
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
        console.error("Standings Error Detail:", e.response ? e.response.status : e.message);
        res.json(cacheData.standings[leagueCode] || []);
    }
});

app.get("/api/highlights", (req, res) => res.json([]));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

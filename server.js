const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const FOOTBALL_DATA_KEY = "c8c972ee26be439581c583f3d2d5f9cd";
const CACHE_TIME = 5 * 60 * 1000; // ၅ မိနစ် Cache ထားမည်
let cacheData = { fixtures: {}, standings: {}, lastFetch: { fixtures: {}, standings: {} } };

// --- ၁။ ပွဲစဉ်များ (Fixtures) ယူမည့် API ---
app.get("/api/fixtures/date/:date", async (req, res) => {
    const requestedDate = req.params.date;
    const now = Date.now();

    if (cacheData.fixtures[requestedDate] && (now - cacheData.lastFetch.fixtures[requestedDate] < CACHE_TIME)) {
        return res.json(cacheData.fixtures[requestedDate]);
    }

    try {
        const url = `https://api.football-data.org/v4/matches?dateFrom=${requestedDate}&dateTo=${requestedDate}`;
        const response = await axios.get(url, {
            headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
            timeout: 8000 // Connection Timeout ၈ စက္ကန့် သတ်မှတ်ထားသည်
        });

        const matches = response.data.matches || [];
        const processedEvents = matches.map(match => ({
            homeTeam: { name: match.homeTeam.shortName || match.homeTeam.name, id: match.homeTeam.id },
            awayTeam: { name: match.awayTeam.shortName || match.awayTeam.name, id: match.awayTeam.id },
            homeScore: { display: match.score.fullTime.home !== null ? match.score.fullTime.home : "-" },
            awayScore: { display: match.score.fullTime.away !== null ? match.score.fullTime.away : "-" },
            startTimestamp: new Date(match.utcDate).getTime() / 1000,
            status: { type: match.status === "IN_PLAY" ? "inprogress" : "notstarted" },
            tournament: { name: match.competition.name }
        }));

        cacheData.fixtures[requestedDate] = processedEvents;
        cacheData.lastFetch.fixtures[requestedDate] = now;
        res.json(processedEvents);

    } catch (e) {
        console.error("Fixture API Error:", e.message);
        res.json([]); // Error ဖြစ်ရင် App မှာ အဝိုင်းမလည်အောင် အလွတ် [] ပို့သည်
    }
});

// --- ၂။ အမှတ်ပေးဇယား (Standings) ယူမည့် API ---
app.get("/api/standings/:leagueCode", async (req, res) => {
    const leagueCode = req.params.leagueCode || "PL"; // Default အနေဖြင့် Premier League (PL) ယူမည်
    const now = Date.now();

    if (cacheData.standings[leagueCode] && (now - cacheData.lastFetch.standings[leagueCode] < CACHE_TIME)) {
        return res.json(cacheData.standings[leagueCode]);
    }

    try {
        const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`, {
            headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
            timeout: 8000
        });
        
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
        res.json([]);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} - Standings API added`));

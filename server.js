const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const FOOTBALL_DATA_KEY = "c8c972ee26be439581c583f3d2d5f9cd";
const CACHE_TIME = 5 * 60 * 1000; // ၅ မိနစ် Cache ထားမည်
let cacheData = { fixtures: {}, lastFetch: { fixtures: {} } };

app.get("/api/fixtures/date/:date", async (req, res) => {
    const requestedDate = req.params.date;
    const now = Date.now();

    if (cacheData.fixtures[requestedDate] && (now - cacheData.lastFetch.fixtures[requestedDate] < CACHE_TIME)) {
        return res.json(cacheData.fixtures[requestedDate]);
    }

    try {
        const url = `https://api.football-data.org/v4/matches?dateFrom=${requestedDate}&dateTo=${requestedDate}`;
        const response = await axios.get(url, {
            headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY }
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
        console.error("API Error:", e.message);
        // Error ဖြစ်ရင် အဝိုင်းမလည်စေရန် အလွတ် [] ပို့မည်
        res.json([]);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

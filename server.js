const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

// Email ကရတဲ့ မင်းရဲ့ Token ကို ဒီမှာ ထည့်ထားပေးတယ်
const FOOTBALL_DATA_KEY = "c8c972ee26be439581c583f3d2d5f9cd";

let cacheData = { fixtures: {}, lastFetch: { fixtures: {} } };
const CACHE_TIME = 15 * 60 * 1000;

app.get("/api/fixtures/date/:date", async (req, res) => {
    const date = req.params.date; // Format: YYYY-MM-DD
    const now = Date.now();

    if (cacheData.fixtures[date] && (now - cacheData.lastFetch.fixtures[date] < CACHE_TIME)) {
        return res.json(cacheData.fixtures[date]);
    }

    try {
        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY }
        });

        const matches = response.data.matches || [];
        
        // Cloudflare Worker က ဖတ်လို့ရမယ့် ပုံစံအတိုင်း ပြောင်းလဲခြင်း
        const processedEvents = matches.map(match => ({
            homeTeam: { 
                name: match.homeTeam.shortName || match.homeTeam.name, 
                id: match.homeTeam.id 
            },
            awayTeam: { 
                name: match.awayTeam.shortName || match.awayTeam.name, 
                id: match.awayTeam.id 
            },
            homeScore: { display: match.score.fullTime.home !== null ? match.score.fullTime.home : "0" },
            awayScore: { display: match.score.fullTime.away !== null ? match.score.fullTime.away : "0" },
            startTimestamp: new Date(match.utcDate).getTime() / 1000,
            status: { type: match.status === "IN_PLAY" ? "inprogress" : "notstarted" },
            tournament: { name: match.competition.name }
        }));

        cacheData.fixtures[date] = processedEvents;
        cacheData.lastFetch.fixtures[date] = now;
        res.json(processedEvents);
    } catch (e) {
        console.error("Football-Data Error:", e.message);
        res.json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running on Football-Data.org API"));

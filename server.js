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
    const requestedDate = req.params.date; // ဥပမာ - 2026-02-11
    const now = Date.now();

    // Cache စစ်ဆေးခြင်း
    if (cacheData.fixtures[requestedDate] && (now - cacheData.lastFetch.fixtures[requestedDate] < CACHE_TIME)) {
        return res.json(cacheData.fixtures[requestedDate]);
    }

    try {
        // အရေးကြီးသည်- URL format ကို သေချာစစ်ပါ
        const url = `https://api.football-data.org/v4/matches?dateFrom=${requestedDate}&dateTo=${requestedDate}`;
        
        const response = await axios.get(url, {
            headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY }
        });

        // Logs မှာ ဒေတာလာ၊ မလာ စစ်ဆေးရန်
        console.log(`Fetching data for ${requestedDate}, Count: ${response.data.resultSet?.count || 0}`);

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
        // Error ဖြစ်ခဲ့ရင် Logs မှာ အသေအချာပြရန်
        console.error("Fixture Error Detail:", e.response?.data || e.message);
        res.status(500).json({ error: "Failed to fetch matches", detail: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running on Football-Data.org API"));

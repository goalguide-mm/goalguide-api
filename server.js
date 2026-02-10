const express = require("express");
const axios = require("axios"); // <--- ဒီကောင်ရှိဖို့ npm install axios အရင်လုပ်ရမယ်
const cors = require("cors");
const app = express();

app.use(cors());

const FOOTBALL_DATA_KEY = "c8c972ee26be439581c583f3d2d5f9cd";

// API ခေါ်ယူရန် Configuration
const footballApi = axios.create({
    baseURL: "https://api.football-data.org/v4",
    headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
    timeout: 30000 // ၃၀ စက္ကန့်အထိ စောင့်မည်
});

app.get("/api/fixtures/date/:date", async (req, res) => {
    const { date } = req.params;
    console.log(`Searching for date: ${date}`);

    try {
        const response = await footballApi.get(`/matches?dateFrom=${date}&dateTo=${date}`);
        const matches = response.data.matches || [];

        const processed = matches.map(match => ({
            homeTeam: { name: match.homeTeam.shortName || match.homeTeam.name },
            awayTeam: { name: match.awayTeam.shortName || match.awayTeam.name },
            homeScore: { display: match.score.fullTime.home ?? "-" },
            awayScore: { display: match.score.fullTime.away ?? "-" },
            startTimestamp: new Date(match.utcDate).getTime() / 1000,
            status: { type: match.status.toLowerCase() },
            tournament: { name: match.competition.name }
        }));

        res.json(processed);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json([]);
    }
});

// Standings API
app.get("/api/standings/:leagueCode", async (req, res) => {
    try {
        const league = req.params.leagueCode || "PL";
        const response = await footballApi.get(`/competitions/${league}/standings`);
        const standings = response.data.standings[0].table.map(team => ({
            position: team.position,
            teamName: team.team.shortName || team.team.name,
            played: team.playedGames,
            points: team.points,
            goalDifference: team.goalDifference
        }));
        res.json(standings);
    } catch (error) {
        res.status(500).json([]);
    }
});

app.get("/api/highlights", (req, res) => res.json([]));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '4c9add6d3582492aacdec6bd646ff229'; 

// 1. MATCHES ROUTE (Updated logic to match football-data.org structure)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 60000
        });

        // Frontend logic နဲ့ ကိုက်အောင် data structure ကို ပြန်ညှိပေးထားပါတယ်
        const matches = (response.data.matches || []).map(m => ({
            tournament: { name: m.competition.name },
            homeTeam: { name: m.homeTeam.shortName || m.homeTeam.name },
            awayTeam: { name: m.awayTeam.shortName || m.awayTeam.name },
            homeScore: { display: m.score.fullTime.home !== null ? m.score.fullTime.home : '-' },
            awayScore: { display: m.score.fullTime.away !== null ? m.score.fullTime.away : '-' },
            status: { type: m.status === 'IN_PLAY' ? 'inprogress' : 'timed' },
            startTimestamp: Math.floor(new Date(m.utcDate).getTime() / 1000)
        }));

        res.json(matches);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json([]);
    }
});

// 2. STANDINGS ROUTE (Added for Table tab)
app.get('/api/standings/:league', async (req, res) => {
    try {
        const { league } = req.params;
        const response = await axios.get(`https://api.football-data.org/v4/competitions/${league}/standings`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const table = response.data.standings[0].table.map(row => ({
            position: row.position,
            teamName: row.team.shortName || row.team.name,
            played: row.playedGames,
            goalDifference: row.goalDifference,
            points: row.points
        }));
        res.json(table);
    } catch (error) {
        res.status(500).json([]);
    }
});

// 3. HIGHLIGHTS (Dummy for now to avoid crash)
app.get('/api/highlights', (req, res) => res.json([]));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

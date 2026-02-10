const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS ကို အားလုံးအတွက် လုံးဝပွင့်သွားအောင် လုပ်ပေးထားပါတယ်
app.use(cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'X-Auth-Token']
}));

// သင့်ရဲ့ API Key
const API_KEY = '4c9add6d3582492aacdec6bd646ff229'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching matches for: ${date}`);

        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 60000 
        });

        // Frontend (script.js) က data.matches.tournament.name ဆိုပြီး ဖတ်ထားတာဖြစ်လို့
        // ဒီနေရာမှာ အတိအကျ ပြန်ပြင်ပေးထားပါတယ်
        const matches = (response.data.matches || []).map(m => ({
            tournament: { name: m.competition.name },
            homeTeam: { name: m.homeTeam.shortName || m.homeTeam.name },
            awayTeam: { name: m.awayTeam.shortName || m.awayTeam.name },
            homeScore: { display: m.score.fullTime.home !== null ? m.score.fullTime.home : '-' },
            awayScore: { display: m.score.fullTime.away !== null ? m.score.fullTime.away : '-' },
            status: { type: m.status === 'IN_PLAY' ? 'inprogress' : 'timed' },
            startTimestamp: Math.floor(new Date(m.utcDate).getTime() / 1000)
        }));

        res.status(200).json(matches);
    } catch (error) {
        console.error("API Error Detail:", error.message);
        // Error ဖြစ်ရင်တောင် Frontend မှာ မရပ်သွားအောင် အလွတ် [] ပို့ပေးပါမယ်
        res.status(200).json([]); 
    }
});

// Table အတွက် Route
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
    } catch (error) { res.json([]); }
});

app.get('/api/highlights', (req, res) => res.json([]));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

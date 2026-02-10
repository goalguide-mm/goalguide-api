const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS ကို အသေအချာ ခွင့်ပြုပေးတဲ့အပိုင်း (အရေးကြီးဆုံးပါ)
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");
    next();
});

const API_KEY = '4c9add6d3582492aacdec6bd646ff229'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 60000 
        });

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
        // Error ဖြစ်လည်း website မှာ Connection Error မပြအောင် အလွတ် [] ပို့ပေးလိုက်မယ်
        res.status(200).json([]); 
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));

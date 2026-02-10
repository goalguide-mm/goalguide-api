const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';

app.get('/api/fixtures/date/:date', async (req, res) => {
    const { date } = req.params;
    
    try {
        // API Approval စောင့်နေစဉ်အတွင်း error မတက်အောင် 
        // အောက်က API ခေါ်ယူမှုကို try-catch နဲ့ သေချာဖမ်းထားပါတယ်
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { date: date },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // အကယ်၍ API က Data ပေးရင် အစစ်ကိုသုံးမယ်
        if (response.data.response && response.data.response.length > 0) {
            const matches = response.data.response.map(m => ({
                tournament: { name: m.league.name },
                homeTeam: { name: m.teams.home.name },
                awayTeam: { name: m.teams.away.name },
                homeScore: { display: m.goals.home ?? '-' },
                awayScore: { display: m.goals.away ?? '-' },
                status: { type: m.fixture.status.short.toLowerCase() },
                startTimestamp: m.fixture.timestamp
            }));
            return res.json(matches);
        }

        // API က approval မကျသေးရင် သို့မဟုတ် data မရှိရင် 
        // Website မှာ ဘာမှမပေါ်တာမျိုးမဖြစ်အောင် ဒီ Mock Data ကို ပြပေးထားမယ်
        const mockMatches = [
            {
                tournament: { name: "Premier League" },
                homeTeam: { name: "Liverpool" },
                awayTeam: { name: "Real Madrid" },
                homeScore: { display: "2" },
                awayScore: { display: "1" },
                status: { type: "finished" },
                startTimestamp: Math.floor(Date.now() / 1000)
            },
            {
                tournament: { name: "La Liga" },
                homeTeam: { name: "Barcelona" },
                awayTeam: { name: "Man City" },
                homeScore: { display: "-" },
                awayScore: { display: "-" },
                status: { type: "timed" },
                startTimestamp: Math.floor(Date.now() / 1000) + 7200
            }
        ];
        res.json(mockMatches);

    } catch (error) {
        res.status(200).json([]);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));

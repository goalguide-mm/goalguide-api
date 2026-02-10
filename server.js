const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const RAPID_HOST = 'free-livescore-api.p.rapidapi.com';

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const options = {
            method: 'GET',
            url: `https://${RAPID_HOST}/livescore/get-fixtures`, // Fixture ယူရန် endpoint
            params: { date: date.replace(/-/g, '') }, // API က 20260210 ပုံစံတောင်းတတ်လို့ပါ
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_HOST
            }
        };

        const response = await axios.request(options);
        
        // API response ကို သင့် Website format အတိုင်းပြောင်းခြင်း
        if (response.data && response.data.response) {
            const matches = response.data.response.map(m => ({
                tournament: { name: m.Stg?.Nm || "Football" },
                homeTeam: { name: m.T1?.[0]?.Nm || "Home" },
                awayTeam: { name: m.T2?.[0]?.Nm || "Away" },
                homeScore: { display: m.Tr1 || "0" },
                awayScore: { display: m.Tr2 || "0" },
                status: { type: m.Eps === "FT" ? "finished" : "live" },
                startTimestamp: Math.floor(new Date().getTime() / 1000) // အစမ်းပြရန်
            }));
            return res.json(matches);
        }
        res.json([]);
    } catch (error) {
        console.error(error);
        res.json([]);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`API is Live!`));

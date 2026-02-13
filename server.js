const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';

// Port ကို 3000 ပဲ ထားလိုက်ပါတော့မယ် (Tunnel နဲ့ ပိုကိုက်အောင်လို့ပါ)
const PORT = 3000;

app.get('/api/highlights', async (req, res) => {
    try {
        const response = await axios.get(`https://free-football-soccer-videos.p.rapidapi.com/`, {
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'free-football-soccer-videos.p.rapidapi.com' }
        });
        res.json(response.data || []);
    } catch (e) { res.json([]); }
});

app.get('/api/standings/:league', async (req, res) => {
    try {
        const response = await axios.get(`https://free-livescore-api.p.rapidapi.com/soccer/standings`, {
            params: { league: '25' },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'free-livescore-api.p.rapidapi.com' }
        });
        res.json(response.data.data || response.data || []);
    } catch (e) { res.json([]); }
});

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://free-livescore-api.p.rapidapi.com/soccer/fixtures-by-date`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'free-livescore-api.p.rapidapi.com' }
        });
        res.json(response.data.data || response.data || []);
    } catch (e) { res.json([]); }
});

app.listen(PORT, () => console.log('Server is running on port ' + PORT));

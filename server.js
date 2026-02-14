const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const WORKER_URL = "https://rapid-cell-5054.pmk818299.workers.dev";

// Root path စစ်ရန်
app.get('/', (req, res) => res.send("Backend is Live!"));

// သင့် index.html နဲ့ ကိုက်အောင် /api/matches လို့ ပြန်ပေးထားတယ်
app.get('/api/matches', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

// Standings အတွက် (leagueSlug ပါရင်လည်း လက်ခံအောင်လုပ်ပေးထားတယ်)
app.get('/api/standings/:league?', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

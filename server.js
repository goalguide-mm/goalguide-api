const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// MATCHES & STANDINGS အကုန်လုံးကို Socolive (Worker) ဆီကနေပဲ ယူမယ့်အပိုင်း
const WORKER_URL = "https://rapid-cell-5054.pmk818299.workers.dev";

app.get('/api/matches', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

app.get('/api/standings', async (req, res) => {
    try {
        // Standings အတွက်လည်း Socolive Worker ကိုပဲ သုံးမယ်ဆိုရင်
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

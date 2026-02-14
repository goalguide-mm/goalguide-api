const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const WORKER_URL = "https://rapid-cell-5054.pmk818299.workers.dev";

// Server အလုပ်လုပ်ကြောင်း အရင်စစ်ဖို့ Root path
app.get('/', (req, res) => {
    res.send("Backend is Live!");
});

// Matches ယူမယ့် path
app.get('/matches', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

// Standings ယူမယ့် path
app.get('/standings', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

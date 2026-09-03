const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Mood Tracker DB!'))
    .catch(err => console.log('Database error:', err));

app.use('/api/mood', require('./routes/moodRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Mood Tracker API running on port ${PORT}`);
});
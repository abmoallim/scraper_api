const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const scrapeRoutes = require('./routes/scrapeRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));


// Routes
app.use('/api', scrapeRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Scraper API');
});

module.exports = app;

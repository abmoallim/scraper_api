const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

// Define the POST route for /scrape
router.post('/scrape', scrapeController.scrapeUrl);

// Define the GET route for retrieving scraped data by userId
router.get('/scraped/:userId', scrapeController.getScrapedDataByUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

// Define the POST route for /scrape
router.post('/scrape', scrapeController.scrapeUrl);

module.exports = router;

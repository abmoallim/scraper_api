const browserService = require('../services/browserService');
const ScrapedData = require('../models/ScrapedData');

exports.scrapeUrl = async (req, res) => {
    const { url, instructions, userId } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const { data, actionsPerformed } = await browserService.executeInstructions(url, instructions);

        const newScrapedData = new ScrapedData({
            userId,
            url,
            ...data,
            actionsPerformed, // Save actions performed as part of the data
        });

        await newScrapedData.save();

        return res.json({
            message: `Successfully scraped ${url}`,
            data: { ...data, actionsPerformed },
        });
    } catch (error) {
        console.error('Scraping error:', error);
        return res.status(500).json({ error: 'Failed to scrape the URL' });
    }
};

exports.getScrapedDataByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const scrapedData = await ScrapedData.find({ userId });
        return res.json(scrapedData);
    } catch (error) {
        console.error('Error retrieving scraped data:', error);
        return res.status(500).json({ error: 'Failed to retrieve data' });
    }
};

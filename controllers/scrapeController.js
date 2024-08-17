const puppeteer = require('puppeteer');

exports.scrapeUrl = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Perform actions like scraping or clicking buttons here

        await browser.close();

        // For now, just return the URL
        return res.json({ message: `Successfully accessed ${url}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to scrape the URL' });
    }
};

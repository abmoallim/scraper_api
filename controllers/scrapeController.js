const puppeteer = require('puppeteer');
const ScrapedData = require('../models/ScrapedData');

exports.scrapeUrl = async (req, res) => {
    const { url, userId } = req.body;  // Include userId in the request body

    if (!url || !userId) {
        return res.status(400).json({ error: 'URL and userId are required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        const pageTitle = await page.title();
        const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No description available');
        
        let links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
        links = [...new Set(links)];
        links = links.filter(link => link !== url && link);

        const pageText = await page.evaluate(() => document.body.innerText);
        const refinedText = await page.evaluate(() => {
            const headers = Array.from(document.querySelectorAll('h1, h2, h3')).map(header => header.innerText);
            const paragraphs = Array.from(document.querySelectorAll('p')).map(paragraph => paragraph.innerText);
            return {
                headers: headers.join(' | '),
                paragraphs: paragraphs.join('\n\n'),
            };
        });

        const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

        await browser.close();

        // Save the scraped data to the database
        const scrapedData = new ScrapedData({
            userId,
            url,
            title: pageTitle,
            description: metaDescription,
            links,
            text: pageText,
            refined_text: refinedText,
            images
        });
        
        await scrapedData.save();

        return res.json({
            message: `Successfully accessed ${url}`,
            data: scrapedData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to scrape the URL' });
    }
};

// Fetch all scraped data for a specific user
exports.getScrapedDataByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await ScrapedData.find({ userId });
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
};

const puppeteer = require('puppeteer');

exports.scrapeUrl = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        // Scrape the page title
        const pageTitle = await page.title();

        // Scrape the meta description
        const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No description available');

        // Scrape all links
        const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));

        // Scrape the main text content
        const pageText = await page.evaluate(() => document.body.innerText);

        // Scrape all images
        const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

        await browser.close();

        // Return the scraped data in JSON format
        const data = {
            title: pageTitle,
            description: metaDescription,
            links: links,
            text: pageText, // Example: Return first 200 characters
            images: images,
        }
        console.log(`Data Text: ${data.text}`); 
        
        return res.json({
            message: `Successfully accessed ${url}`,
            data : data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to scrape the URL' });
    }
};

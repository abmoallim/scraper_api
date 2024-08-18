const { chromium } = require('playwright');

exports.executeInstructions = async (url, instructions) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let actionsPerformed = [];

    try {
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        for (const instruction of instructions) {
            if (instruction.wait) {
                await page.waitForTimeout(instruction.wait);
                actionsPerformed.push(`Waited for ${instruction.wait} milliseconds`);
            }
            if (instruction.wait_for) {
                await page.waitForSelector(instruction.wait_for);
                actionsPerformed.push(`Waited for selector ${instruction.wait_for}`);
            }
            if (instruction.click) {
                const elementExists = await page.$(instruction.click);
                if (elementExists) {
                    await page.click(instruction.click);
                    actionsPerformed.push(`Clicked on ${instruction.click}`);
                } else {
                    actionsPerformed.push(`Element not found for click action: ${instruction.click}`);
                    console.warn(`Element not found for selector: ${instruction.click}`);
                }
            }
            if (instruction.type) {
                const elementExists = await page.$(instruction.type[0]);
                if (elementExists) {
                    await page.type(instruction.type[0], instruction.type[1]);
                    actionsPerformed.push(`Typed into ${instruction.type[0]}: "${instruction.type[1]}"`);
                } else {
                    actionsPerformed.push(`Element not found for type action: ${instruction.type[0]}`);
                    console.warn(`Element not found for selector: ${instruction.type[0]}`);
                }
            }
            if (instruction.scroll) {
                await page.evaluate(`window.scrollBy(0, ${instruction.scroll})`);
                actionsPerformed.push(`Scrolled by ${instruction.scroll}px`);
            }
        }

        // Scrape the page title
        const pageTitle = await page.title();

        // Scrape the meta description
        const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No description available');

        // Scrape all links
        let links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
        links = [...new Set(links)]; // Remove duplicates
        links = links.filter(link => link !== url && link); // Remove current URL and empty links

        // Scrape the main text content (unrefined)
        const pageText = await page.evaluate(() => document.body.innerText);

        // Refine text by extracting content from specific elements
        const refinedText = await page.evaluate(() => {
            const headers = Array.from(document.querySelectorAll('h1, h2, h3')).map(header => header.innerText);
            const paragraphs = Array.from(document.querySelectorAll('p')).map(paragraph => paragraph.innerText);
            return {
                headers: headers.join(' | '),
                paragraphs: paragraphs.join('\n\n'),
            };
        });

        // Scrape all images
        const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

        await browser.close();

        return {
            data: {
                title: pageTitle,
                description: metaDescription,
                links,
                text: pageText,
                refined_text: refinedText,
                images,
            },
            actionsPerformed,
        };
    } catch (error) {
        await browser.close();
        throw new Error(`Failed to execute instructions on the page: ${error.message}`);
    }
};

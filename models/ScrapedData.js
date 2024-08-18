const mongoose = require('mongoose');

const ScrapedDataSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: 'No description available' },
    links: { type: [String], default: [] },
    text: { type: String, default: '' },
    refined_text: {
        headers: { type: String, default: '' },
        paragraphs: { type: String, default: '' }
    },
    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

const ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);

module.exports = ScrapedData;

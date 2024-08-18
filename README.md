# Scraper API

This project is a web scraping API built with Node.js, Express, and Puppeteer. It allows users to scrape web pages and store the extracted data in a MongoDB database.

## Features

- Scrape web pages for various data including title, meta description, links, text content, and images
- Store scraped data in MongoDB
- User-specific data storage and retrieval
- RESTful API endpoints for scraping and data retrieval

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
```git clone https://github.com/yourusername/scraper_api.git```

2. Install dependencies:
   ```npm install```
  
3. Create a `.env` file in the root directory and add your MongoDB URI:
   ```MONGO_URI=your_mongodb_uri_here```

### Usage

1. Start the server:
   ```npm start```
   
2. The server will run on `http://localhost:3000` by default.

## API Endpoints

- `POST /api/scrape`: Scrape a URL
- Body: `{ "url": "https://example.com", "userId": "user123" }`

- `GET /api/scrape/:userId`: Retrieve scraped data for a specific user

## Technologies Used

- Express.js
- Puppeteer
- MongoDB with Mongoose
- Cors
- Dotenv

## Front-end Repository

The front-end for this project can be found here: https://github.com/abmoallim/scraper

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.




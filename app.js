// Assuming you're using Node.js with Express
const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const port = process.env.PORT || 3000;

const NEO4J_URI = 'neo4j+s://2320fe1e.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'tktfTZlXVF6lPMwPglT6vl3Hv5NNNcwqsQIq6LpLq-k';

const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
    { maxTransactionRetryTime: 30000 }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files like CSS

// Endpoint for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add additional endpoints for other HTML pages if needed
// Example:
app.get('/directory', (req, res) => {
    res.sendFile(path.join(__dirname, 'directory.html'));
});

// Other routes as defined previously...

app.listen(port, () => {
    console.log("Server running on port", port);
});

process.on('exit', async () => {
    await driver.close();
});

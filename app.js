const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const port = process.env.PORT || 3000;

const NEO4J_URI = 'neo4j+s://5159a76c.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'iMPDP8-5B4wYGnQRNGIBKP4M7dEoR1EJ9APqT7YiDso';

const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
    { maxTransactionRetryTime: 30000 }
);

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ... other existing routes ...

app.get('/react-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// ... other existing routes including /add-person ...

app.listen(port, () => {
    console.log("Server running on port", port);
});

process.on('exit', async () => {
    await driver.close();
});

const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');
require('dotenv').config(); // Add this line if you're using dotenv for environment variables

const app = express();
const port = process.env.PORT || 3000;

// Use environment variables for credentials
const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;

// Setup the Neo4j driver
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test-db-connection', async (req, res) => {
    const session = driver.session();
    try {
        await session.run('MATCH (n) RETURN n LIMIT 1');
        res.send('Connection to Neo4j Aura successful!');
    } catch (error) {
        res.status(500).send('Failed to connect to Neo4j Aura.');
    } finally {
        await session.close();
    }
});

// POST route to handle form submission
app.post('/submit-form', async (req, res) => {
    const { firstName, middleName, lastName, opnliId } = req.body;

    const session = driver.session();
    try {
        const result = await session.run(
            'CREATE (p:Person {firstName: $firstName, middleName: $middleName, lastName: $lastName, opnliId: $opnliId}) RETURN p', 
            { firstName, middleName, lastName, opnliId }
        );

        res.send("Data added to Neo4j Aura");
    } catch (error) {
        console.error("Error adding data to Neo4j Aura:", error);
        res.status(500).send("Error processing request");
    } finally {
        await session.close();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port", port);
});

// Close Neo4j driver on server close
process.on('exit', () => {
    driver.close();
});

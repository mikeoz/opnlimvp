const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');
require('dotenv').config(); // Add this line if you're using dotenv for environment variables

const app = express();

// Use environment variables for credentials
const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;

// Setup the Neo4j driver
const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

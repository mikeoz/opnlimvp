const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');
require('dotenv').config(); // Use dotenv for environment variables

const app = express();
const port = process.env.PORT || 3000;

// Setup the Neo4j driver using environment variables
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to test database connection
app.get('/test-db-connection', async (req, res) => {
    const session = driver.session();
    try {
        const serverInfo = await session.getServerInfo();
        res.send('Connection to Neo4j Aura successful! Server info: ' + JSON.stringify(serverInfo));
    } catch (error) {
        res.status(500).send('Failed to connect to Neo4j Aura. Error: ' + error.message);
    } finally {
        await session.close();
    }
});

// POST route to handle form submission and create a new Person node
app.post('/submit-form', async (req, res) => {
    const { firstName, middleName, lastName, opnliId } = req.body;
    const session = driver.session();
    try {
        await session.run(
            'CREATE (p:Person {firstName: $firstName, middleName: $middleName, lastName: $lastName, opnliId: $opnliId}) RETURN p', 
            { firstName, middleName, lastName, opnliId }
        );
        res.send("Person node added to Neo4j Aura");
    } catch (error) {
        res.status(500).send("Error adding data to Neo4j Aura: " + error.message);
    } finally {
        await session.close();
    }
});

// GET route to list all Person nodes
app.get('/list-members', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (p:Person) RETURN p.firstName + COALESCE(" " + p.middleName + " ", " ") + p.lastName + ", " + p.opnliId AS fullDetails'
        );
        const members = result.records.map(record => record.get('fullDetails'));
        res.send(members.join('<br>'));
    } catch (error) {
        res.status(500).send("Error fetching members from Neo4j Aura: " + error.message);
    } finally {
        await session.close();
    }
});

app.listen(port, () => {
    console.log("Server running on port", port);
});

// Close Neo4j driver on server close
process.on('exit', () => {
    driver.close();
});

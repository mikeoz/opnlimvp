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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to test database connection
app.get('/test-db-connection', async (req, res) => {
    const session = driver.session();
    try {
        await session.run('RETURN "Connection successful!" AS message');
        const timestamp = new Date().toLocaleString();
        res.send('Connection complete at ' + timestamp);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Failed to connect to Neo4j Aura. Error: ' + error.message);
    } finally {
        await session.close();
    }
});

// Endpoint to list members
app.get('/list-members', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run('MATCH (p:Person) RETURN p');
        const members = result.records.map(record => record.get('p').properties);
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Endpoint to add a person
app.post('/add-person', async (req, res) => {
    const session = driver.session();
    try {
        // Extract data from request body
        const { firstName, middleName, lastName, opnliId } = req.body;
        // Create a new person in the database
        const result = await session.run(
            'CREATE (p:Person {firstName: $firstName, middleName: $middleName, lastName: $lastName, opnliId: $opnliId}) RETURN p',
            { firstName, middleName, lastName, opnliId }
        );
        res.status(201).json(result.records[0].get('p').properties);
    } catch (error) {
        console.error('Error adding person:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});


app.listen(port, () => {
    console.log("Server running on port", port);
});

process.on('exit', async () => {
    await driver.close();
});


// Version 4

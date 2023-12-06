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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/add-person', async (req, res) => {
    const { firstName, middleName, lastName, personId } = req.body;
    const session = driver.session();
    try {
        await session.run(
            'CREATE (p:Person {firstName: $firstName, middleName: $middleName, lastName: $lastName, personId: $personId})',
            { firstName, middleName, lastName, personId }
        );
        res.json({ message: 'Person added successfully', data: req.body });
    } catch (error) {
        console.error('Error adding person:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.get('/test-db-connection', async (req, res) => {
    const session = driver.session();
    try {
        await session.run('RETURN "Connection successful!" AS message');
        res.send('Connection complete at ' + new Date().toLocaleString());
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Failed to connect to Neo4j Aura. Error: ' + error.message);
    } finally {
        await session.close();
    }
});

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

app.listen(port, () => {
    console.log("Server running on port", port);
});

process.on('exit', async () => {
    await driver.close();
});

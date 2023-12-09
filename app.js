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

app.get('/news.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'news.html'));
});

app.get('/directory.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'directory.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Adding route for 'index.html' to address the "Test Add Card Button" issue
app.get('/index.html', (req, res) => {
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

// Maintain the existing endpoint for adding a person
app.post('/add-person', async (req, res) => {
    const session = driver.session();
    try {
        const { person_id, first_name, middle_name, last_name } = req.body; // Use the field names as per Neo4j Aura expectations
        const result = await session.run(
            'CREATE (p:Person {personId: $person_id, firstName: $first_name, middleName: $middle_name, lastName: $last_name}) RETURN p',
            { person_id, first_name, middle_name, last_name }
        );
        const person = result.records[0].get('p').properties;
        res.json({ message: 'Person added', person });
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

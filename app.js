const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const port = process.env.PORT || 3000;

// Corrected Neo4j database connection details
const NEO4J_URI = 'neo4j+s://e9ccf68a.databases.neo4j.io'; // Ensure the use of neo4j+s
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'Iw-YJYK1DLRlqvjd2BrpfKBTcSUqoPcNGo_mqNEWHQ';

// Setup the Neo4j driver
const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
    { maxTransactionRetryTime: 30000 }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON bodies

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

// Add the endpoint for listing members
app.get('/list-members', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run('MATCH (p:Person) RETURN p');
        const members = result.records.map(record => record.get('p').properties);
        res.json(members); // Send response in JSON format
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

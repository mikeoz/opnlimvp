const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const port = process.env.PORT || 3000;

// Corrected Neo4j database connection details
const NEO4J_URI = 'neo4j://e9ccf68a.databases.neo4j.io'; // Changed from neo4j+s to neo4j
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'Iw-YJYK1DLRlqvjd2BrpfKBTcSUqoPcNGo_mqNEWHQ';

// Setup the Neo4j driver
const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
    { maxTransactionRetryTime: 30000 }
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
        const writeTxResultPromise = session.writeTransaction(async txc => {
            var result = await txc.run('RETURN "Connection successful!" AS message');
            return result.records.map(record => record.get('message'));
        });

        const message = await writeTxResultPromise;
        res.send('Connection to Neo4j Aura successful! Message: ' + message);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Failed to connect to Neo4j Aura. Error: ' + error.message);
    } finally {
        await session.close();
    }
});

app.listen(port, () => {
    console.log("Server running on port", port);
});

// Close Neo4j driver on server close
process.on('exit', async () => {
    await driver.close();
});

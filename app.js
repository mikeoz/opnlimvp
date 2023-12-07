// Assuming you're using Node.js with Express
const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const port = process.env.PORT || 3000;

// Neo4j Aura database credentials
const NEO4J_URI = 'neo4j+s://2320fe1e.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'tktfTZlXVF6lPMwPglT6vl3Hv5NNNcwqsQIq6LpLq-k';

// Create a driver instance, for the user neo4j with password neo4j
const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to add a new person
app.post('/add-person', async (req, res) => {
    const { firstName, middleName, lastName, personId } = req.body;
    const session = driver.session();
    try {
        await session.run('CREATE (p:Person {firstName: $firstName, middleName: $middleName, lastName: $lastName, personId: $personId})', {
            firstName, middleName, lastName, personId
        });
        res.json({ message: 'Person added successfully', data: req.body });
    } catch (error) {
        console.error('Error adding person:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Add endpoints for other actions like testing connection, listing members, etc.

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Close the Neo4j driver when the Node.js process exits
process.on('exit', async () => {
    await driver.close();
});

// Additional functions for handling form submissions, database queries, etc.

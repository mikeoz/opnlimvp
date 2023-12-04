const express = require('express');
const neo4j = require('neo4j-driver');
const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to the home page");
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log("Wazzzzapp");
});


app.use(express.json());

const driver = neo4j.driver(/neo4j+s://e9ccf68a.databases.neo4j.io/, neo4j.auth.basic(/neo4j/, /3Iw-YJYK1DLRlqvjd2BrpfKBTcSUqoPcNGo_mqNEWHQ/));
const session = driver.session();

app.post('/createPerson', async (req, res) => {
    const { firstName, middleName, lastName, personId } = req.body;
    try {
        await session.run(
            'CREATE (p:Person {first_name: $firstName, middle_name: $middleName, last_name: $lastName, person_id: $personId})',
            { firstName, middleName, lastName, personId }
        );
        res.status(200).send('Person created successfully');
    } catch (error) {
        console.error('Error creating person:', error);
        res.status(500).send('Error creating person');
    }
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


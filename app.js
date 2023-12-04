const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Wazzzzapp");
});

app.get('/', (req, res) => {
    res.send("Welcome to the home page");
});

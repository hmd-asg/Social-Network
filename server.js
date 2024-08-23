const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const db = require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });
});
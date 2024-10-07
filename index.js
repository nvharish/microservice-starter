const express = require('express');
const handler = require('./src/api.controller');

process.loadEnvFile();

const app = express();
app.use(express.json());

app.listen(process.env.APP_PORT, () => {
    handler(app);
});

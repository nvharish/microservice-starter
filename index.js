const express = require('express');
process.loadEnvFile();
const logHandler = require('./src/middlewares/logHandler');
const errorHandler = require('./src/middlewares/errorHandler');
const apiName = require('./src/controllers/apiName');
const morgan = require('morgan');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(morgan(logHandler));
app.use('/', apiName(router));

// eslint-disable-next-line no-unused-vars
app.use((req, res, _next) => {
    res.status(404).json({
        status: 'ERROR',
        error: 'Not found',
    });
});

app.listen(process.env.SERVICE_PORT, () => {
    // eslint-disable-next-line no-console
    console.log({
        nodeVersion: process.version,
        host: `0.0.0.0:${process.env.SERVICE_PORT}`,
    });
});

app.use(errorHandler);

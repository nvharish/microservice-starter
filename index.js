const express = require('express');
process.loadEnvFile();
const logger = require('./src/lib/logger');
const logHandler = require('./src/middlewares/logHandler');
const errorHandler = require('./src/middlewares/errorHandler');
const apiName = require('./src/controllers/apiName');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(logHandler);
app.use('/', apiName(router));

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    res.status(404).json({
        status: 'ERROR',
        error: 'Not found',
    });
});

app.listen(process.env.SERVICE_PORT, () => {
    logger.info(
        JSON.stringify({
            remoteAddr: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}`,
        })
    );
});

app.use(errorHandler);

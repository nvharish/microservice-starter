const logger = require('../lib/logger');
const { getErrorLog } = require('../lib/utils');

module.exports = function (err, req, res, next) {
    const logData = getErrorLog(err, req, res);

    logger.error(JSON.stringify(logData, null, 2));

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode ?? 500).json({
        status: 'ERROR',
        error: res.statusMessage ?? 'Internal server error',
    });
};

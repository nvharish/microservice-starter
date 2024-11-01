const logger = require('../lib/logger');
const { getRequestLog, getResponseLog } = require('../lib/utils');

module.exports = function (req, res, next) {
    const timer = logger.startTimer();

    res.on('finish', () => {
        const logData = {
            requestId: crypto.randomUUID(),
            request: getRequestLog(req),
            response: getResponseLog(res),
        };

        timer.done({
            level: 'info',
            message: JSON.stringify(logData, null, 2),
        });
    });

    next();
};

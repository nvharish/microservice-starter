const {
    responseStatus,
    httpStatusCodes,
    httpStatusMessages,
} = require('../lib/constants');

module.exports = function (err, _req, res, next) {
    res.locals.errorMessage = err.message;
    res.locals.errorStack = err.stack;

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode ?? httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        status: responseStatus.ERROR,
        error: err.statusMessage ?? httpStatusMessages.INTERNAL_SERVER_ERROR,
    });
};

const morgan = require('morgan');

morgan.token('level', (_req, res) => {
    const status = res.statusCode;
    const level = {
        error: 'ERROR',
        info: 'INFO',
        warn: 'WARN',
    };

    if (status >= 500) {
        return `\x1b[31m${level.error}\x1b[0m`; // Red
    }
    if (status >= 400) {
        return `\x1b[33m${level.warn}\x1b[0m`; // Yellow
    }

    return `\x1b[32m${level.info}\x1b[0m`; // Green
});

morgan.token('error', (_req, res) => {
    return `${res.locals.errorMessage || ''} stack: ${
        res.locals.errorStack || ''
    }`;
});

module.exports = function (tokens, req, res) {
    const log = {
        'x-trace-id': req.header['x-trace-id'],
        'http-version': tokens['http-version'](req, res),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        'content-type': tokens.req(req, res, 'content-type'),
        accept: tokens.req(req, res, 'accept'),
        host: tokens.req(req, res, 'host'),
        body: tokens.req(req, res, 'body'),
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        'content-length': tokens.res(req, res, 'content-length'),
        referrer: tokens['referrer'](req, res),
        'remote-addr': tokens['remote-addr'](req, res),
        'remote-user': tokens['remote-user'](req, res),
        'user-agent': tokens['user-agent'](req, res),
        'response-time': `${tokens['response-time'](req, res)} ms`,
        'total-time': `${tokens['total-time'](req, res)} ms`,
    };

    if (res.statusCode >= 500 || res.statusCode >= 400) {
        log.error = tokens.error(req, res);
    }

    return `${tokens['date'](req, res)} [${tokens['level'](
        req,
        res
    )}] ${JSON.stringify(log, null, 2)}`;
};

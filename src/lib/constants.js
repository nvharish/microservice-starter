const http = require('http');

const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    MULTI_STATUS: 207,
    MOVED_PERMANENTLY: 301,
    MOVED_TEMPORARILY: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_NOT_AVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};

const httpStatusMessages = {};

for (const [key, val] of Object.entries(httpStatusCodes)) {
    httpStatusMessages[key] = http.STATUS_CODES[val];
}

const responseStatus = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};

module.exports = { httpStatusCodes, httpStatusMessages, responseStatus };

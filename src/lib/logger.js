const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const os = require('os');

const changeCase = format((info, opts) => {
    if (opts.uppercase) {
        info.level = info.level.toUpperCase();
    } else if (opts.lowercase) {
        info.level = info.level.toUpperCase();
    }
    return info;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        hostname: os.hostname(),
        nodeVersion: process.version,
        service: process.env.SERVICE_NAME,
        port: process.env.SERVICE_PORT,
        serviceVersion: process.env.SERVICE_VERSION,
    },
    format: combine(
        changeCase({ uppercase: true }),
        colorize({
            level: true,
        }),
        timestamp(),
        printf(({ timestamp, level, message, durationMs }) => {
            return `${timestamp} [${level}] ${message} ${
                durationMs ? `duration: ${durationMs} ms` : ''
            } `;
        })
    ),
    transports: [new transports.Console()],
    exitOnError: false,
});

module.exports = logger;

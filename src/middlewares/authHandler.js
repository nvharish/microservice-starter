const {
    httpStatusCodes,
    httpStatusMessages,
    responseStatus,
} = require('../lib/constants');
const { verifyJwt } = require('../lib/utils');

module.exports = function (req, res, next) {
    const jwt = req.get('Authorization')?.replace('Bearer ', '');
    verifyJwt(jwt, (err, user) => {
        if (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).send({
                status: responseStatus.ERROR,
                error: httpStatusMessages.UNAUTHORIZED,
            });
        } else {
            req.user = user;
            next();
        }
    });
};

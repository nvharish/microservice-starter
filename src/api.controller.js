const { verifyJwt } = require('./lib/utils');
const http = require('http');

module.exports = function handler(app) {
    /**
     * you can remove the following code if JWT verification is not required for your service
     */
    app.use((req, res, next) => {
        const jwt = req.get('Authorization').replace('Bearer ', '');

        verifyJwt(jwt, (err, user) => {
            if (err) {
                res.status(401).send({
                    message: http.STATUS_CODES[401],
                });
            } else {
                req.user = user;
                next();
            }
        });
    });

    /**
     * write code for api routes and handlers
     */

    app.get('/', (req, res) => {
        res.send(req.user);
    });
};

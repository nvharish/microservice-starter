const { verifyJwt } = require('../lib/utils');

module.exports = function (router) {
    /**
     * you can remove the following code if JWT verification is not required for your service
     */
    router.use((req, res, next) => {
        // const jwt = req.get('Authorization').replace('Bearer ', '');
        // verifyJwt(jwt, (err, user) => {
        //     if (err) {
        //         res.status(401).send({
        //             message: http.STATUS_CODES[401],
        //         });
        //     } else {
        //         req.user = user;
        //         next();
        //     }
        // });
        next();
    });

    /**
     * write code for api routes and handlers
     */

    router.get('/', (req, res) => {
        throw new Error('BROKEN');
    });

    return router;
};

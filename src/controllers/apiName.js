const authHandler = require('../middlewares/authHandler');

module.exports = function (router) {
    router.use(authHandler);

    router.get('/', (req, res) => {
        throw new Error('BROKEN');
    });

    return router;
};

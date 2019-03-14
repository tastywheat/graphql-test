const { log } = require('../logger');

function requestMiddleware () {
    return (req, res, next) => {
        log('Request', {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
        });

        next();
    };
}

module.exports = requestMiddleware;

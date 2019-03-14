const createDebug = require('debug');

const debuggers = {};

module.exports = {
    log (msg, data) {
        console.log(JSON.stringify({
            msg,
            time: new Date().toISOString(),
            ...data,
        }));
    },
    debug (key, ...args) {
        if (!debuggers[key]) {
            debuggers[key] = createDebug(key);
        }

        debuggers[key](`[${new Date().toISOString()}]`, ...args);
    },
};

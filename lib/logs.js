const debug = require('debug');
const path = require('path');



class Logs {
    constructor(filename) {
        const debugname = path.basename(filename, path.extname(filename));
        const boundConsoleLog = console.info.bind(console);

        this._filename = debugname;
        this._debug = debug(debugname);
        this._info = debug(debugname + '*');
        this._error = debug(debugname + ':<error>*');

        this.debug.log = boundConsoleLog;
        this.error.log = boundConsoleLog;
    }

    debug(...args) {
        this._debug(...args);
    }

    info(...args) {
        console.info(...args);
        this._info(...args);
    }

    error(...args) {
        console.info(...args);
        this._error(...args);
    }
}

module.exports = {
    forFilename: (filename) => new Logs(filename)
}
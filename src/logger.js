var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'file',
            filename: "test.log",
            category: 'ReviewService'
        }
  ],
    replaceConsole: true
});
var logger = log4js.getLogger('ReviewService');
logger.setLevel('DEBUG');
Object.defineProperty(exports, "LOG", {
    value: logger,
});
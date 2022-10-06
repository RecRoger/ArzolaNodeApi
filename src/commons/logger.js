import log4js from 'log4js'

log4js.configure({
    appenders: {
        loggerDev: {type: "console"},
        loggerWarn: {type: "file", filename: "./logs/warns.log"},
        loggerError: {type: "file", filename: "./logs/errors.log"}
    },
    categories: {
        default: { appenders: ["loggerDev"], level: "all"},
        prod: {appenders: ["loggerError"], level: "error"},
    }
});

export let logger;

if( process.env.NODE_ENV === 'PROD') {
    logger = log4js.getLogger('prod');
} else {
    logger = log4js.getLogger();
}
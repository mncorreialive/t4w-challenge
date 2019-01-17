const { createLogger, format, transports } = require('winston'),    
    { combine, timestamp, colorize, printf, splat, simple, prettyPrint} = format,    
    Promise = require('bluebird');
require('winston-daily-rotate-file');

    function _settinLogLevels () {
    
        const consoleTransport = new transports.Console({
            level: 'info',
            stderrLevels: ['error']
        })

        const rotateLogFile = new (transports.DailyRotateFile)({
            filename: './logs/backend-%DATE%.log',
            verbose: false,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '14d'
        })
        
        const logger = createLogger({
            level:'info',
            format: combine(                
                format((info) => {
                    info.level = info.level.toUpperCase()
                    return info
                })(),
                prettyPrint(),
                timestamp(),
                colorize({colors:{info: 'green', debug: 'blue', error:'red', warning: 'yellow'}}),
                printf(info => `${info.timestamp} - [${info.level}] : ${info.message}`)
                
            ),
            transports: [rotateLogFile]
        });
    
        if(process.env.NODE_DEBUG || process.env.NODE_ENV !== 'production'){
            consoleTransport.level = 'debug'
            logger.level = 'debug'
        }
        logger.add(consoleTransport)    
        return Promise.resolve(logger)
    }
    
    function _overridingDefaultConsoles(logger) {
        console.debug = (message) => {
            logger.debug(message)
        }
        console.info = (message) => {
            logger.info(message)
        }
        console.warn = (message) => {
            logger.warn(message)
        }
        console.error = (message) => {
            logger.error(message)
        }
        return Promise.resolve()
    }
    

class LoggerService {
    static setupLoggerService() {  
        return Promise.resolve()
        .then(_settinLogLevels)
        .then(_overridingDefaultConsoles)
        .catch((err) => Promise.reject(err))
    }
    
    
}

module.exports = LoggerService;
const asyncRedis = require('async-redis')
class CacheDb {
    constructor(config) {
        this.config={
            host: config.host,
            port: config.port,
        }

        return asyncRedis.createClient(this.config.port, this.config.host)
    }
}

module.exports = CacheDb
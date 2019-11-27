const BeanstalkdWorker = require('beanstalkd-worker')

class WorkQueue {
    constructor(config) {
        this.config={
            host: config.host,
            port: config.port,
            channel: config.channel,
        }

        this.worker=new BeanstalkdWorker(this.config.host,  this.config.port)
        return this;
    }

    transmit(job) {
        return this.worker.spawn(this.config.channel, job)
    }

    disconnect() {
        this.worker.stop()
    }
}

module.exports = WorkQueue
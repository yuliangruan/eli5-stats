//interface for interacting with some kind of queue/messaging solution.  beanstalkd, rabbit, activemq whatever

class  QueueInterface {
    constructor () {

    }
    
    /**
     * join a queue/channel
     *
     * @memberof QueueInterface
     */
    join = () => {}

    /**
     * leave a queue/channel
     *
     * @memberof QueueInterface
     */
    leave = () => {}

    /**
     * transmit a job to queue/channel
     *
     * @memberof QueueInterface
     */
    transmit = () => {}

    /**
     * reserve a job on the queue/channel 
     *
     * @memberof QueueInterface
     */
    reserve = () => {}

    /**
     * delete a job from queue/channel
     *
     * @memberof QueueInterface
     */
    delete  = () => {}
}

module.exports = QueueInterface
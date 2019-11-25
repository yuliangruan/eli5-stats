const snoowrap = require('snoowrap')
const uuid =  require('uuid')
const promise = require('promise')
const exception = require('exception')

class RedditApi {
    constructor (config) {
        this.config={
            authDest: config.authDest,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            apiDest: config.apiDest,
            redirectUrl:config.redirectUrl,
            monitorSub: config.monitorSub,
            refreshToken: config.refreshToken,
        }
        this.store={
            newPosts: [],
        }
    }

    auth () {
        try {
            let client = new snoowrap({
                userAgent: 'eli5-stats',
                clientId: this.config.clientId,
                clientSecret: this.config.clientSecret,
                refreshToken: this.config.refreshToken
            });
            return client
        } catch (e) {
            throw new exception('failed to create requestor ' + e)
        }
    }

    getNew(client) {
        const opts = {
            subreddit: this.config.monitorSub,
            limit: 25
        };

        let r=client
        return r.getNewComments(opts.subreddit, {
            limit: opts.limit
          })
    }
}

module.exports =  RedditApi;
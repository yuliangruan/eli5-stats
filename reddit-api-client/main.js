const fs = require('fs')
const yaml = require('js-yaml')
const exception = require('exception')

const RedditApi=require('./services/RedditApi')

try {
    const configFile = fs.readFileSync('config.yml', 'utf8')
    const secretFile = fs.readFileSync('config-secret.yml', 'utf8')
    const configSecret = yaml.safeLoad(secretFile)
    
    let config = yaml.safeLoad(configFile)
    config.services.redditApi = {...config.services.redditApi, ...configSecret.redditApi}

    const redditApi = new RedditApi(config.services.redditApi);

    redditApi.auth().getNew()
        .then(console.log)
        .catch(function(err) {
            throw new exception(err);
        })

} catch (e) {
    console.error(e);
}

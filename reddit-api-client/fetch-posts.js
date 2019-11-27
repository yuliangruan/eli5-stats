const fs = require('fs')
const yaml = require('js-yaml')
const exception = require('exception')
const promise = require('promise')

const RedditApi=require('./services/RedditApi')
const WorkQueue=require('./services/WorkQueue')
const CacheDb=require('./services/CacheDb')


function main() {
    try {
        const configFile = fs.readFileSync('config.yml', 'utf8')
        const secretFile = fs.readFileSync('config-secret.yml', 'utf8')
        const configSecret = yaml.safeLoad(secretFile)
        
        var config = yaml.safeLoad(configFile)
        config.services.redditApi = {...config.services.redditApi, ...configSecret.redditApi}

        function submitJob(listing) {
            const workQueueClient=new WorkQueue(config.services.beanstalkd);
            const cacheDb = new CacheDb(config.services.redis);
            let  allPromises=[]
            process.setMaxListeners(listing.length)

            //send jobid to WorkQueue as well as send job detail to 
            cacheDb.on('connect',function() {
                for (let i=0,n=listing.length;i<n;i++) {
                    allPromises.push(
                        new Promise((resolve,reject) => {
                                cacheDb.set(listing[i].id, JSON.stringify(listing[i]))
                        })
                        .then()
                        .catch(function(e) {throw(e)})
                    )
                }
            })

            for (let i=0,n=listing.length;i<n;i++) {
                allPromises.push(
                    workQueueClient.transmit(
                        {
                        'action':'parse-post',
                        'data':listing[i].id,
                        }
                    )
                    .then()
                    .catch(function (e) {
                        throw(e)
                    })
                )
            }

            promise.all(allPromises,function(res,err){
                //just wait, do nothing, we're just submitting the job
            })
            
            setTimeout(()=>{process.exit(0)},1000)
        }

        const redditApi = new RedditApi(config.services.redditApi);
        redditApi.auth()
        .getNew(config.services.redditApi.monitorSub,{limit: config.services.redditApi.getNewMax})
            .then(submitJob)
            .catch(function(err) {
                throw new exception(err);
            })

        } catch (e) {
        console.error(e);
    }
}

main();


const fastify = require('fastify')({ logger: true })
module.exports = class VoicenterWebSDK {
    constructor(options) {
        this.options = options;
        this.port = 3000
        this.host = '0.0.0.0'
        this.fastify = fastify
        if(options){
            if(options.port)this.port=options.port
            if(options.host)this.host=options.host
        }

    }
    async start () {
        try {
            this.fastify.register(require('./routes/Ivr'), { prefix: '/Ivr' })

            await this.fastify.listen({ port: this.port, host: this.host})
            fastify.log.info(`server listening on ${fastify.server.address().port}`)
        } catch (err) {
            this.fastify.log.error(err)
            process.exit(1)
        }
    }
    stop () {
        // access this.options
    }
}

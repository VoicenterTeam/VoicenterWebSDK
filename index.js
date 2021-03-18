global.config = {};
const fastify = require('fastify')({ logger: true });
const path = require('path');

module.exports = class VoicenterWebSDK {
    constructor(options) {
        this.options = options;

        this.config = {};
        this.config.port = 3000;
        this.config.host = '0.0.0.0';
        this.config.callLogicFolder = null;
        this.fastify = fastify;
        this.config.modulePath = path.join(__dirname + "/../../");
        if (options) {
            if (options.port) this.config.port = options.port;
            if (options.host) this.config.host = options.host;
            if (options.modulePath) this.config.modulePath = options.modulePath;
            if (options.callLogicFolder) this.config.callLogicFolder = options.callLogicFolder;
        }
        global.config = this.config

    }
    async start() {
        try {
            this.fastify.register(require('./routes/Ivr'), { prefix: '/Ivr' });
            this.fastify.register(require('./routes/Cdr'), { prefix: '/Cdr' });
            this.fastify.register(require('./routes/Popup'), { prefix: '/Popup' });
            this.fastify.register(require('./routes/PopupApprove'), { prefix: '/PopupApprove' });

            await this.fastify.listen({ port: this.config.port, host: this.config.host });
            fastify.log.info(`server listening on ${fastify.server.address().port}`)
        } catch (err) {
            this.fastify.log.error(err);
            process.exit(1)
        }
    }
    stop() {
        // access this.options
    }
};

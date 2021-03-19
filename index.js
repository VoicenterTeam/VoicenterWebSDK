global.config = {}; //TODO
const fastify = require('fastify')({ logger: true });
const path = require('path');

module.exports = class VoicenterWebSDK {
  constructor(options = {}) {
    this.options = options;

    this.config = {};
    this.config.port = options.port || 3000;
    this.config.host = options.host || '0.0.0.0';
    this.config.callLogicFolder = options.callLogicFolder || null;
    this.config.modulePath = options.modulePath || path.join(__dirname + "/../../");

    this.fastify = fastify;

    global.config = this.config;
  }

  async start() {
    try {
      this.fastify.register(require('./routes/Ivr'), { prefix: '/Ivr' });
      this.fastify.register(require('./routes/Cdr'), { prefix: '/Cdr' });
      this.fastify.register(require('./routes/Popup'), { prefix: '/Popup' });
      this.fastify.register(require('./routes/PopupApprove'), { prefix: '/PopupApprove' });

      await this.fastify.listen({ port: this.config.port, host: this.config.host });

      fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
      this.fastify.log.error(err);

      process.exit(1);
    }
  }
}

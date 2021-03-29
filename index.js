const fastify = require('fastify')({ logger: true });
const path = require('path');

module.exports = class VoicenterWebSDK {
  constructor(options = {}) {
    this.options = options;

    this.config = {
      port: 3000,
      host: '0.0.0.0',
      modulePath: path.join(__dirname + "/../../"),
    };

    this.config = { ...this.config, ...options };

    this.fastify = fastify;

    this.routeList = new Map([
      ['./routes/Ivr', { prefix: '/Ivr', config: this.config }],
      ['./routes/Cdr', { prefix: '/Cdr', config: this.config }],
      ['./routes/Popup', { prefix: '/Popup', config: this.config }],
      ['./routes/PopupApprove', { prefix: '/PopupApprove', config: this.config }],
    ]);
  }

  async start() {
    try {
      this.routeList.forEach((options, route) => {
        this.fastify.register(require(route), options);
      });

      await this.fastify.listen({ port: this.config.port, host: this.config.host });

      fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
      this.fastify.log.error(err);

      process.exit(1);
    }
  }
}

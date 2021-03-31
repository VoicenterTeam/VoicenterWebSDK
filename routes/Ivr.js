const CallRequest = require("../libs/CallRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', (req, reply) => ivrHandler(req, reply, opts));
  fastify.post('/:modulePath', (req, reply) => ivrHandler(req, reply, opts));
  done()
}

async function ivrHandler(req, reply, opts) {
  req.params.modulePath = replacer(req.params.modulePath);
  let callRequest = new CallRequest(req, reply, opts.config);
  await callRequest.execute();
}

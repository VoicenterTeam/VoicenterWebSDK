const CdrRequest = require("../libs/CdrRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', (req, reply) => cdrHandler(req, reply, opts));
  fastify.post('/:modulePath', (req, reply) => cdrHandler(req, reply, opts));
  done()
};

async function cdrHandler(req, reply, opts) {
  req.params.modulePath = replacer(req.params.modulePath);
  let cdrRequest = new CdrRequest(req, reply, opts.config);

  try {
    cdrRequest.parseRequest();
    await cdrRequest.execute();
  } catch(err) {
    console.error("cdrHandler Global ERROR ", err)
  }
}

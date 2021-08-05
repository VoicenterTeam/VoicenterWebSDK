const replacer = require('../libs/callLogicParamsFormater');
const ProxyRequest = require('../libs/ProxyRequest');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', (req, reply) => proxyHandler(req, reply, opts));
  fastify.post('/:modulePath', (req, reply) => proxyHandler(req, reply, opts));
  done();
};

async function proxyHandler(req, reply, opts) {
  req.params.modulePath = replacer(req.params.modulePath);
  let proxyRequest = new ProxyRequest(req, reply, opts.config);

  try {
    proxyRequest.parseRequest();
    await proxyRequest.execute();
  } catch(err) {
    console.error("cdrHandler Global ERROR ", err);
  }
}

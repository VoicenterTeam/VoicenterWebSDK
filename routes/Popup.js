const PopupRequest = require("../libs/PopupRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', (req, reply) => popupHandler(req, reply, opts));
  fastify.post('/:modulePath', (req, reply) => popupHandler(req, reply, opts));
  done()
};

async function popupHandler(req, reply, opts) {
  req.params.modulePath = replacer(req.params.modulePath);
  let popupRequest = new PopupRequest(req, reply, opts.config);
  try {
    popupRequest.parseRequest();
    await popupRequest.execute();
  } catch(err) {
    console.error("popupHandler Global ERROR ", err);
  }
}

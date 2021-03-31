const PopupApproveRequest = require("../libs/PopupApproveRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', (req, reply) => popupApproveHandler(req, reply, opts));
  fastify.post('/:modulePath', (req, reply) => popupApproveHandler(req, reply, opts));
  done()
};

async function popupApproveHandler(req, reply, opts) {
  req.params.modulePath = replacer(req.params.modulePath);
  let popupApproveRequest = new PopupApproveRequest(req, reply, opts.config);
  try {
    popupApproveRequest.parseJWTData();
    await popupApproveRequest.execute();
  } catch (err) {
    console.error("popupHandler Global ERROR ", err);
  }
}

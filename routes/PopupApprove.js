const PopupApproveRequest = require("../libs/PopupApproveRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', popupApproveHandler);
  fastify.post('/:modulePath', popupApproveHandler);
  done()
};

async function popupApproveHandler(req, reply) {
  req.params.modulePath = replacer(req.params.modulePath);
  let popupApproveRequest = new PopupApproveRequest(req, reply);
  try {
    popupApproveRequest.parseJWTData();
    await popupApproveRequest.execute();
  } catch (err) {
    console.error("popupHandler Global ERROR ", err);
  }
  // await  callRequest.Execute()
  //  reply.send({hello:"word"})
}

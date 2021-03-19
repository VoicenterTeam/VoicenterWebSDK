const CallRequest = require("../libs/CallRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
  fastify.get('/:modulePath', ivrHandler);
  fastify.post('/:modulePath', ivrHandler);
  done()
}

async function ivrHandler(req, reply) {
  req.params.modulePath = replacer(req.params.modulePath);
  let callRequest = new CallRequest(req, reply);
  await callRequest.execute();
  // await  callRequest.Execute()
  //  reply.send({hello:"word"})
}

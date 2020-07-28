const CallRequest = require("../libs/CallRequest")
const replacer = require('../libs/callLogicParamsFormater')


module.exports = function (fastify, opts, done) {
    fastify.get('/:CallLogic', ivrHandler)
    fastify.post('/:CallLogic', ivrHandler)
    done()
}

async function ivrHandler  (req, reply) {
    req.params.CallLogic = replacer(req.params.CallLogic);
    let callRequest = new CallRequest(req, reply)
    await callRequest.DoCallLogic();
   // await  callRequest.Execute()
  //  reply.send({hello:"word"})

}

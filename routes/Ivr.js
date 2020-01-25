const CallRequest = require("../libs/CallRequest")


module.exports = function (fastify, opts, done) {
    fastify.get('/:CallLogic', ivrHandler)
    fastify.post('/:CallLogic', ivrHandler)
    done()
}

async function ivrHandler  (req, reply) {
    let callRequest = new CallRequest(req, reply)
    await callRequest.DoCallLogic();
   // await  callRequest.Execute()
  //  reply.send({hello:"word"})

}
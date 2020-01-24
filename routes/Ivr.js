const CallRequest = require("../libs/CallRequest")


module.exports = function (fastify, opts, done) {
    fastify.get('/:CallLogic', handler)
    fastify.post('/:CallLogic', handler)
    done()
}

async function  handler  (req, reply) {
    let callRequest = new CallRequest(req, reply)
    await callRequest.DoCallLogic();
   // await  callRequest.execute()
  //  reply.send({hello:"word"})

}
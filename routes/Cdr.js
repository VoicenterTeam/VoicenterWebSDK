const CdrRequest = require("../libs/CdrRequest");



module.exports = function (fastify, opts, done) {
    fastify.get('/:CdrLogic', cdrHandler);
    fastify.post('/:CdrLogic', cdrHandler);
    done()
};

async function cdrHandler  (req, reply) {
    let cdrRequest = new CdrRequest(req, reply);
    try{
        await cdrRequest.ParseRequest();
        await cdrRequest.DoCdrLogic();
    }catch (e) {
        console.error("cdrHandler Global ERROR ",e)
    }
    // await  callRequest.Execute()
  //  reply.send({hello:"word"})

}

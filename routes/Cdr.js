const CdrRequest = require("../libs/CdrRequest");
const replacer = require('../libs/callLogicParamsFormater')


module.exports = function (fastify, opts, done) {
    fastify.get('/:CdrLogic', cdrHandler);
    fastify.post('/:CdrLogic', cdrHandler);
    done()
};

async function cdrHandler  (req, reply) {
    req.params.CallLogic = replacer(req.params.CdrLogic);
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


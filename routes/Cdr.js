const CdrRequest = require("../libs/CdrRequest");
const replacer = require('../libs/callLogicParamsFormater')


module.exports = function (fastify, opts, done) {
    fastify.get('/:modulePath', cdrHandler);
    fastify.post('/:modulePath', cdrHandler);
    done()
};

async function cdrHandler  (req, reply) {
    req.params.modulePath = replacer(req.params.modulePath);
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


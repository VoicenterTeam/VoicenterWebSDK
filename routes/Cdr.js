const CdrRequest = require("../libs/CdrRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
    fastify.get('/:modulePath', cdrHandler);
    fastify.post('/:modulePath', cdrHandler);
    done()
};

async function cdrHandler(req, reply) {
    req.params.modulePath = replacer(req.params.modulePath);
    let cdrRequest = new CdrRequest(req, reply);
    try {
        cdrRequest.parseRequest();
        await cdrRequest.execute();
    } catch (err) {
        console.error("cdrHandler Global ERROR ", err)
    }
    // await  callRequest.Execute()
    //  reply.send({hello:"word"})

}


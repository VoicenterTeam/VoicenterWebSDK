const PopupRequest = require("../libs/PopupRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
    fastify.get('/:modulePath', popupHandler);
    fastify.post('/:modulePath', popupHandler);
    done()
};

async function popupHandler(req, reply) {
    req.params.modulePath = replacer(req.params.modulePath);
    let popupRequest = new PopupRequest(req, reply);
    try {
        popupRequest.parseRequest();
        await popupRequest.execute();
    } catch (err) {
        console.error("popupHandler Global ERROR ", err);
    }
    // await  callRequest.Execute()
    //  reply.send({hello:"word"})

}

const PopupRequest = require("../libs/PopupRequest");
const replacer = require('../libs/callLogicParamsFormater');



module.exports = function (fastify, opts, done) {
    fastify.get( '/:modulePath', popupHandler);
    fastify.post('/:modulePath', popupHandler);
    done()
};

async function popupHandler  (req, reply) {
    req.params.modulePath = replacer(req.params.modulePath);
    let popupRequest = new PopupRequest(req, reply);
    try{
        await popupRequest.ParseRequest();
        await popupRequest.DoPopupLogic();
    }catch (e) {
        console.error("popupHandler Global ERROR ",e)
    }
    // await  callRequest.Execute()
  //  reply.send({hello:"word"})

}

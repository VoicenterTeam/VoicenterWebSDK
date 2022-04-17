const PopupRequest = require("../libs/PopupRequest");
const replacer = require('../libs/callLogicParamsFormater');



module.exports = function (fastify, opts, done) {
    fastify.get( '/:PopupLogic', popupHandler);
    fastify.post('/:PopupLogic', popupHandler);
    done()
};

async function popupHandler  (req, reply) {
    req.params.PopupLogic = replacer(req.params.PopupLogic);
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

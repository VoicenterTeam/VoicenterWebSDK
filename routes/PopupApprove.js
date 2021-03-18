const PopupApproveRequest = require("../libs/PopupApproveRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
    fastify.get( '/:modulePath', popupApproveHandler);
    fastify.post('/:modulePath', popupApproveHandler);
    done()
};

async function popupApproveHandler  (req, reply) {
    req.params.modulePath = replacer(req.params.modulePath);
    let popupApproveRequest = new PopupApproveRequest(req, reply);
    try{
        // await popupApproveRequest.ParseRequest();
        await popupApproveRequest.ParseJWTData();
        await popupApproveRequest.DoPopupApproveLogic();
    }catch (e) {
        console.error("popupHandler Global ERROR ",e)
    }
    // await  callRequest.Execute()
  //  reply.send({hello:"word"})

}

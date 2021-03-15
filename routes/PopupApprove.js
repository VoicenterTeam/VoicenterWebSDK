const PopupApproveRequest = require("../libs/PopupApproveRequest");
const replacer = require('../libs/callLogicParamsFormater');

module.exports = function (fastify, opts, done) {
    fastify.get( '/:PopupApproveLogic', popupApproveHandler);
    fastify.post('/:PopupApproveLogic', popupApproveHandler);
    done()
};

async function popupApproveHandler  (req, reply) {
    req.params.PopupApproveLogicPath = replacer(req.params.PopupApproveLogic);
    let popupApproveRequest = new PopupApproveRequest(req, reply);
    try{
        await popupApproveRequest.ParseRequest();
        await popupApproveRequest.DoPopupApproveLogic();
    }catch (e) {
        console.error("popupHandler Global ERROR ",e)
    }
    // await  callRequest.Execute()
  //  reply.send({hello:"word"})

}

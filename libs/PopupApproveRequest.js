let popupLogicFolder = __dirname + "/../../../";
if (global.config.popupLogicFolder) popupLogicFolder = __dirname + "/../../../" + global.config.popupLogicFolder;
console.log("Loading PopupRequest Class , popup Logic folder is :", popupLogicFolder);
const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");
const PopupRequest = require("./PopupRequest");
const jwt = require("jsonwebtoken");

let keyConfig = {};
try {
    keyConfig = require(popupLogicFolder + '/' + 'keyConfig');
} catch(err) {
    console.log(err);
}

const jwtKey = keyConfig.jwtKey;

module.exports = class PopupApproveRequest extends PopupRequest {
    constructor(request, reply) {
        super(request, reply);
        this.popupLogic = null;
        this.popupURL = null;
        this.Result = '';
    }

    async ParseJWTData() {
        let jwtData = jwt.verify(this.request.query.data, jwtKey);
        Object.assign(this, jwtData);
    }

    Done() {
        this.done = true;
        this.reply.type('text/html');
        this.reply.send(this.Result);
    }

    async DoPopupApproveLogic() {
        await this.popupLogic(this);
        if (!this.done) this.Done();
    }
}

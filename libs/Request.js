// let actionFolder = __dirname + "/../../../";
// if (global.config.actionFolder) actionFolder = __dirname + "/../../../" + global.config.actionFolder;
// console.log("Loading PopupRequest Class , popup Logic folder is :", global.config.modulePath);
const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");
const path = require('path');

module.exports = class Request {
    constructor(request, reply) {
        this.modulePath = global.config.modulePath;
        this.request = request;
        this.reply = reply;
        this.actionLogic = null;
        this.requestFields = new Map();
    }

    clearActionModule() {
        try {
            if (this.request.params.modulePath && (this.request.query.reload || this.request.query.Reload)) {
                clear(path.join(this.modulePath, this.request.params.modulePath));
            }
        } catch (err) {
            console.error("MODULE reload failed  " + this.request.params.modulePath, err);
        }
    }

    requireActionModule() {
        try {
            this.actionLogic = require(path.join(this.modulePath, this.request.params.modulePath));
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                console.error("MODULE NOT FOUND " + this.request.params.modulePath, err);
            }

            console.error("MODULE load failed  " + this.request.params.modulePath, err);
            console.error("Loading " + path.join(__dirname, "../DefualtCallLogic"));

            this.cdrLogic = require(this.defualtModulePath);
        }
    }

}
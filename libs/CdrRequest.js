// let cdrLogicFolder = __dirname+"/../../../";
// if(global.config.cdrLogicFolder)cdrLogicFolder= __dirname+"/../../../"+global.config.cdrLogicFolder;
// let cdrLogicFolder = global.config.cdrLogicFolder ? global.config.modulesPath + global.config.cdrLogicFolder : global.config.modulesPath;
// console.log("Loading CallRequest Class , Call Logic folder is :", cdrLogicFolder);
const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");

const Request = require('./Request');

module.exports = class CdrRequest extends Request {
    constructor(request, reply) {
        super(request, reply);
        if (global.config.cdrLogicFolder) this.modulePath = global.config.cdrLogicFolder;
        this.done = false;
        this.IVR = [];
        this.CustomDataParmList = [];
        this.ResponseOkData = { "err": 0, "errdesc": "OK" };
        this.requestFields = new Map([
            ['caller', 'caller'],
            ['target', 'target'],
            ['time', 'time'],
            ['duration', 'duration'],
            ['ivruniqueid', 'ivruniqueid'],
            ['type', 'type'],
            ['status', 'status'],
            ['targetextension', 'targetextension'],
            ['callerextension', 'callerextension'],
            ['did', 'did'],
            ['queueid', 'queueid'],
            ['queuename', 'queuename'],
            ['record', 'record'],
            ['price', 'price'],
            ['dialtime', 'dialtime'],
            ['representative_name', 'representative_name'],
            ['representative_code', 'representative_code'],
            ['targetextension_name', 'targetextension_name'],
            ['callerextension_name', 'callerextension_name'],
            ['target_country', 'target_country'],
            ['caller_country', 'caller_country'],
        ]);
        this.requestFields.forEach((classField, bodyField) => {
            this[classField] = null;
        });
        this.clearActionModule();
        this.requireActionModule();
    }
    async ParseRequest() {
        let self = this;
        try {
            if (this.request.body) {
                this.requestFields.forEach((classField, bodyField) => {
                    this[classField] = this.request.body[bodyField] || null;
                });
                if (this.request.body.IVR) {
                    try {
                        let ivrArray = JSON.parse(this.request.body.IVR);
                        if (ivrArray.constructor.name === "Array") this.IVR = ivrArray;
                    } catch (e) {
                        console.error("Failed parse IVR list of cdr ", e);
                        console.error("IVR list", this.request.body.IVR);
                    }
                }

                //Parsing CUSTOM_DATA
                if (this.request.body.CUSTOM_DATA && this.request.body.CUSTOM_DATA.constructor.name === "Object") {
                    Object.keys(this.request.body.DATA.CUSTOM_DATA).forEach(function (varName) {
                        try {
                            self.CustomDataParmList.push(new CallCustomParam(varName, self.request.body.DATA.CUSTOM_DATA[varName], false));
                        } catch (e) {
                            console.error("Failed adding CUSTOM_DATA parameter ", varName);
                        }
                    })
                }
            }
        } catch (err) {
            console.error("parseRequest failed ", err);
        }
    }
    Done() {
        this.done = true;
        this.reply.send(this.ResponseOkData);
    }
    async DoCdrLogic() {
        await this.actionLogic(this);
        if (!this.done) this.Done();

    }

};

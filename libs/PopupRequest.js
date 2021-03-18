const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");
const jwt = require('jsonwebtoken');

const Request = require('./Request');

let keyConfig = {};
try {
    keyConfig = require(global.config.modulePath + '/' + 'keyConfig');
} catch (err) {
    console.log(err);
}

const jwtKey = keyConfig.jwtKey;

module.exports = class PopupRequest extends Request{
    constructor(request, reply) {
        super(request, reply);
        this.done = false;
        // Main Request Popup  Vars
        this.queueid = null;
        this.requestFields = new Map([
            ['phone', 'phone'],
            ['ivrid', 'ivruniqueid'],
            ['extenUser', 'target'],
            ['did', 'did'],
            ['statusCall', 'status'],
            ['approved', 'approved'],
        ]);
        this.requestFields.forEach((classField, bodyField) => {
            this[classField] = null;
        });
        // Set up Response Data
        this.Result = {
            STATUS: "OK",
            URL: "",
            CLIENTNAME: "",
            TOTAL: 0,
            COMPANY: "",
        };
        this.CustomDataParmList = [];
        this.clearActionModule();
        this.requireActionModule();
    }
    async ParseRequest() {
        try {
            if (this.request.body) {
                this.requestFields.forEach((classField, bodyField) => {
                    this[classField] = this.request.body[bodyField] || null;
                });

                //Parsing CUSTOM_DATA
                if (this.request.body.CUSTOM_DATA && this.request.body.CUSTOM_DATA.constructor.name === "Object") {
                    Object.keys(this.request.body.DATA.CUSTOM_DATA).forEach(function (varName) {
                        try {
                            that.CustomDataParmList.push(new CallCustomParam(varName, that.request.body.DATA.CUSTOM_DATA[varName], false));
                        } catch (e) {
                            console.error("Failed adding CUSTOM_DATA parameter ", varName);
                        }
                    })
                }
            }
            else if (this.request.query) {
                this.requestFields.forEach((classField, queryField) => {
                    this[classField] = this.request.query[queryField] || null;
                });

                //Parsing CUSTOM_DATA
                if (this.request.query.CUSTOM_DATA && this.request.query.CUSTOM_DATA.constructor.name === "Object") {
                    Object.keys(this.request.query.DATA.CUSTOM_DATA).forEach(function (varName) {
                        try {
                            that.CustomDataParmList.push(new CallCustomParam(varName, that.request.query.DATA.CUSTOM_DATA[varName], false));
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
        this.reply.send(this.Result);
    }
    async DoPopupLogic() {
        await this.actionLogic(this);
        if (!this.done) this.Done();

    }
    ApprovePopup(approveUrlPath) {
        this.done = true;
        const protocol = this.request.protocol || 'http://';
        const host = this.request.hostname;
        const popupPath = this.request.raw.originalUrl.split('?')[0];
        const query = { ...this, request: undefined, reply: undefined, Result: undefined, popupURL: protocol + host + popupPath };
        this.Result["URL"] = protocol + host + '/PopupApprove/' + approveUrlPath + '?&data=' + jwt.sign(query, jwtKey);
        this.reply.send(this.Result);
    }
    // Call Custom Param Functions  Start
    SetParam(parmName, paramValue) {
        let params = this.CustomDataParmList.filter(function (p) { return p.Name === parmName });
        if (params.length > 0) {
            params.forEach(function (param) {
                param.Update(paramValue);
            })
        } else {
            this.CustomDataParmList.push(new CallCustomParam(parmName, paramValue, true));
        }

    }
    // Call Custom Param Functions  End
};

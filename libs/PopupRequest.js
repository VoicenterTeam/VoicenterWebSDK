const CallCustomParam = require("../libs/ivrAction/callParam");
const jwt = require('jsonwebtoken');

const Request = require('./Request');

let keyConfig = {};
try {
  keyConfig = require(global.config.modulePath + '/' + 'keyConfig');
} catch(err) {
  console.log(err);
}

const jwtKey = keyConfig.jwtKey;

module.exports = class PopupRequest extends Request {
  constructor(request, reply) {
    super(request, reply);

    if (global.config.popupLogicFolder) this.modulePath = global.config.popupLogicFolder;

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
    this.clearActionModule();
    this.requireActionModule();
  }

  parseRequest() {
    try {
      if (this.request.body) {
        this.parseRequestToObject(this.request.body);
        this.parseCustomData(this.request.body.CUSTOM_DATA);
      } else if (this.request.query) {
        this.parseRequestToObject(this.request.query);
        this.parseCustomData(this.request.query.CUSTOM_DATA);
      }
    } catch(err) {
      console.error("parseRequest failed ", err);
    }
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
}

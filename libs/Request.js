const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");
const path = require('path');

module.exports = class Request {
  constructor(request, reply, config) {
    this.config = config;
    this.modulePath = config.modulePath;
    this.request = request;
    this.reply = reply;
    this.executeModule = null;
    this.requestFields = new Map();
    this.Result = null;
    this.CustomDataParmList = [];
    this.responseContentType = 'application/json';
  }

  clearActionModule() {
    try {
      if (this.request.params.modulePath && (this.request.query.reload || this.request.query.Reload)) {
        clear(path.join(this.modulePath, this.request.params.modulePath));
      }
    } catch(err) {
      console.error("MODULE reload failed  " + this.request.params.modulePath, err);
    }
  }

  requireActionModule() {
    try {
      this.executeModule = require(path.join(this.modulePath, this.request.params.modulePath));
    } catch(err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        console.error("MODULE NOT FOUND " + this.request.params.modulePath, err);
      }

      console.error("MODULE load failed  " + this.request.params.modulePath, err);
      console.error("Loading " + path.join(__dirname, "../DefualtCallLogic"));

      this.cdrLogic = require(this.defualtModulePath);
    }
  }

  parseRequestToObject(placeToParse) {
    this.requestFields.forEach((classField, requestField) => {
      this[classField] = placeToParse[requestField] || null;
    });
  }

  parseCustomData(customData) {
    let self = this;
    if (customData && customData.constructor.name == "Object") {
      Object.keys(customData).forEach(function (varName) {
        try {
          self.CustomDataParmList.push(new CallCustomParam(varName, customData[varName], false));
        } catch(err) {
          console.error("Failed adding CUSTOM_DATA parameter ", varName);
        }
      })
    }
  }

  Done() {
    this.done = true;
    
    this.reply.type(this.responseContentType);
    this.reply.send(this.Result);
  }

  async execute() {
    await this.executeModule(this);
    if (!this.done) this.Done();
  }

}

const CallCustomParam = require("../libs/ivrAction/callParam");
const Request = require("./Request");
const jwt = require("jsonwebtoken");

let keyConfig = {};
try {
  keyConfig = require(global.config.modulePath + '/' + 'keyConfig');
} catch (err) {
  console.log(err);
}

const jwtKey = keyConfig.jwtKey;

module.exports = class PopupApproveRequest extends Request {
  constructor(request, reply) {
    super(request, reply);

    if (global.config.popupLogicFolder) this.modulePath = global.config.popupLogicFolder;

    this.popupURL = null;
    this.Result = '';
    this.responseContentType = 'text/html';

    this.clearActionModule();
    this.requireActionModule();
  }

  async parseJWTData() {
    let jwtData = jwt.verify(this.request.query.data, jwtKey);
    Object.assign(this, jwtData);
  }
}

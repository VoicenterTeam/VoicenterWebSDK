const Request = require("./Request");
const jwt = require("jsonwebtoken");

module.exports = class PopupApproveRequest extends Request {
  constructor(request, reply) {
    super(request, reply, config);

    if (config.popupLogicFolder) this.modulePath = config.popupLogicFolder;

    this.popupURL = null;
    this.Result = '';
    this.responseContentType = 'text/html';

    this.clearActionModule();
    this.requireActionModule();
  }

  async parseJWTData() {
    try {
      let jwtData = jwt.verify(this.request.query.data, this.config.jwtKey);
      Object.assign(this, jwtData);
    } catch (err) {
      console.error("Failed to parse request data ", err);
    }
  }
}
